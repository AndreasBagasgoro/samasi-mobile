import { useState, useEffect, useCallback } from 'react';
import { diaryService } from '../services/diary.service';
import {
  DiaryEntryItem,
  DiaryItem,
  DiaryPaginationMeta,
  CreateDiaryPayload,
  UpdateDiaryPayload,
  DeleteDiaryResponse,
} from '../types';
import { useDebounce } from '@shared/hooks';

export interface UseDiaryOptions {
  autoFetch?: boolean;
  defaultLimit?: number;
  initialInteractionTypeId?: string;
  customerId?: string | number;
  employeeId?: string | number;
}

let cachedDiaries: DiaryEntryItem[] | null = null;
let cachedFormattedDiaries: DiaryItem[] | null = null;
const cachedDiaryDetailMap = new Map<string | number, DiaryEntryItem>();

export const useDiary = (options: UseDiaryOptions = {}) => {
  const {
    autoFetch = true,
    defaultLimit = 10,
    initialInteractionTypeId = 'all',
    customerId,
    employeeId,
  } = options;


  const [diaries, setDiaries] = useState<DiaryEntryItem[]>(cachedDiaries || []);
  const [formattedDiaries, setFormattedDiaries] = useState<DiaryItem[]>(cachedFormattedDiaries || []);
  const [selectedDiary, setSelectedDiary] = useState<DiaryEntryItem | null>(null);


  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedQuery = useDebounce(searchQuery, 500);
  const [selectedInteractionTypeId, setSelectedInteractionTypeId] = useState<string>(initialInteractionTypeId);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<DiaryPaginationMeta>({
    total: 0,
    page: 1,
    per_page: defaultLimit,
    total_pages: 1,
  });

  const hasInitialData = Boolean(cachedFormattedDiaries && cachedFormattedDiaries.length > 0);
  const [isLoading, setIsLoading] = useState<boolean>(!hasInitialData);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const formatDiaryData = useCallback((data: DiaryEntryItem[]): DiaryItem[] => {
    return data.map((item) => {
      const raw = item as any;
      const contact = raw.customer_contact || raw.customerContact;
      const customer = contact?.customer || raw.customer;

      const customerName =
        customer?.customer_name ||
        customer?.customerName ||
        raw.customer_name ||
        contact?.customer_name ||
        '';

      const contactName =
        contact?.contact_name ||
        contact?.contactName ||
        raw.contact_name ||
        raw.customer_contact_name ||
        undefined;

      const interactionType =
        item.interaction_type_name ||
        item.interaction_type ||
        item.interaction_type_detail?.interaction_type_name ||
        raw.interactionType ||
        'Call';

      const entryId = item.sales_diary_entry_id ?? raw.id ?? raw.diary_id;

      const contactJobTitle =
        contact?.job_title ||
        contact?.jobTitle ||
        undefined;

      const employeePosition =
        item.employee?.position_name ||
        (item.employee as any)?.positionName ||
        (item.employee as any)?.position ||
        undefined;

      const employeeDivision =
        item.employee?.division_name ||
        (item.employee as any)?.divisionName ||
        item.employee?.office_name ||
        (item.employee as any)?.officeName ||
        undefined;

      const locationName =
        raw.location_name ||
        customer?.city ||
        customer?.address ||
        undefined;

      return {
        id: entryId,
        title: item.title || customerName || 'Sales Interaction',
        interactionType,
        interactionTypeId: item.interaction_type_id,
        interactionTypeCode: item.interaction_type_code,
        entryAt: item.entry_at,
        createdAt: item.created_at,
        notes: item.notes,
        customerId: item.customer_contact?.customer_id || customer?.customer_id,
        customerName: customerName || undefined,
        customerContactId: item.customer_contact_id || raw.mst_customer_contact_id,
        contactName,
        contactJobTitle,
        employeeId: item.employee_id,
        employeeName: item.employee?.full_name,
        employeePosition,
        employeeDivision,
        locationName,
        latitude: item.latitude,
        longitude: item.longitude,
        photos: item.photos,
      };
    });
  }, []);

  const fetchDiaries = useCallback(
    async (
      search?: string,
      page = 1,
      typeId?: string,
      opts?: { forceLoading?: boolean }
    ) => {
      const query = search !== undefined ? search : debouncedQuery;
      const activeTypeId = typeId !== undefined ? typeId : selectedInteractionTypeId;

      const isFilterActive =
        (search !== undefined && search !== '') ||
        (activeTypeId !== 'all' && activeTypeId !== '');

      if (!cachedFormattedDiaries || opts?.forceLoading || page > 1 || isFilterActive) {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await diaryService.getDiaries({
          search: query,
          page,
          per_page: defaultLimit,
          interaction_type_id: activeTypeId !== 'all' ? activeTypeId : undefined,
          customer_id: customerId,
          employee_id: employeeId,
        });

        const formatted = formatDiaryData(response.data);

        // Cache hanya pada initial load (page 1, tanpa search & tanpa filter)
        if (!query && page === 1 && activeTypeId === 'all') {
          cachedDiaries = response.data;
          cachedFormattedDiaries = formatted;
        }

        setDiaries(response.data);
        setFormattedDiaries(formatted);
        setPagination(response.meta);
        setCurrentPage(response.meta.page);
      } catch (err: any) {
        const errorMessage = err?.message || 'Gagal mengambil data diary dari server.';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedQuery, selectedInteractionTypeId, defaultLimit, customerId, employeeId, formatDiaryData]
  );

  const fetchDiaryDetail = useCallback(async (id: string | number) => {
    const cachedDetail = cachedDiaryDetailMap.get(id);
    if (cachedDetail) {
      setSelectedDiary(cachedDetail);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await diaryService.getDiaryById(id);
      cachedDiaryDetailMap.set(id, data);
      setSelectedDiary(data);
      return data;
    } catch (err: any) {
      const errorMessage = err?.message || `Gagal mengambil detail diary dengan ID: ${id}`;
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDiaryById = useCallback(
    (id: string | number | undefined): DiaryItem => {
        
        if (selectedDiary && String(selectedDiary.sales_diary_entry_id) === String(id)) {
            const [formatted] = formatDiaryData([selectedDiary]);
            return formatted;
        }
        const foundInList = formattedDiaries.find((item) => String(item.id) === String(id));
        
      return (
        foundInList || {
          id: id || 'unknown',
          title: 'Diary Detail',
          interactionType: 'Call',
          entryAt: '10:15 AM',
        }
      );
    },
    [formattedDiaries, selectedDiary, formatDiaryData]
  );

  const refreshDiaries = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await diaryService.getDiaries({
        page: 1,
        per_page: defaultLimit,
        search: debouncedQuery,
        interaction_type_id: selectedInteractionTypeId !== 'all' ? selectedInteractionTypeId : undefined,
        customer_id: customerId,
        employee_id: employeeId,
      });

      const formatted = formatDiaryData(response.data);

      if (!debouncedQuery && selectedInteractionTypeId === 'all') {
        cachedDiaries = response.data;
        cachedFormattedDiaries = formatted;
      }

      setDiaries(response.data);
      setFormattedDiaries(formatted);
      setPagination(response.meta);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui data diary.');
    } finally {
      setIsRefreshing(false);
    }
  }, [debouncedQuery, selectedInteractionTypeId, defaultLimit, customerId, employeeId, formatDiaryData]);


  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

 
  const handleFilterChange = useCallback((typeId: string) => {
    setSelectedInteractionTypeId(typeId);
    setCurrentPage(1);
  }, []);

 
  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchDiaries(debouncedQuery, page, selectedInteractionTypeId);
    },
    [fetchDiaries, debouncedQuery, selectedInteractionTypeId]
  );

  const createDiary = useCallback(
    async (payload: CreateDiaryPayload): Promise<DiaryEntryItem | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await diaryService.createDiary(payload);
        // Invalidate cache agar data baru termuat pada fetch berikutnya
        cachedDiaries = null;
        cachedFormattedDiaries = null;
        return data;
      } catch (err: any) {
        const errorMessage = err?.message || 'Gagal menambahkan diary baru.';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateDiary = useCallback(
    async (id: string | number, payload: UpdateDiaryPayload): Promise<DiaryEntryItem | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await diaryService.updateDiary(id, payload);
        // Update detail cache
        cachedDiaryDetailMap.set(id, data);
        setSelectedDiary(data);

        // Invalidate list cache agar sync
        cachedDiaries = null;
        cachedFormattedDiaries = null;
        return data;
      } catch (err: any) {
        const errorMessage = err?.message || `Gagal memperbarui diary dengan ID: ${id}`;
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteDiary = useCallback(
    async (id: string | number): Promise<DeleteDiaryResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await diaryService.deleteDiary(id);
        // Hapus dari cache detail
        cachedDiaryDetailMap.delete(id);

        // Hapus langsung dari state lokal agar UI terupdate seketika
        setDiaries((prev) => prev.filter((item) => String(item.sales_diary_entry_id) !== String(id)));
        setFormattedDiaries((prev) => prev.filter((item) => String(item.id) !== String(id)));

        // Invalidate list cache
        cachedDiaries = null;
        cachedFormattedDiaries = null;
        return result;
      } catch (err: any) {
        const errorMessage = err?.message || `Gagal menghapus diary dengan ID: ${id}`;
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (autoFetch) {
      fetchDiaries(debouncedQuery, 1, selectedInteractionTypeId);
    }
  }, [debouncedQuery, selectedInteractionTypeId, autoFetch, fetchDiaries]);

  return {
    diaries,
    formattedDiaries,
    selectedDiary,
    searchQuery,
    debouncedQuery,
    setSearchQuery,
    handleSearch,
    selectedInteractionTypeId,
    setSelectedInteractionTypeId,
    handleFilterChange,
    pagination,
    currentPage,
    goToPage,
    getDiaryById,
    isLoading,
    isRefreshing,
    error,
    fetchDiaries,
    fetchDiaryDetail,
    formatDiaryData,
    createDiary,
    updateDiary,
    deleteDiary,
    refreshDiaries,
    setError,
  };
};

export default useDiary;
