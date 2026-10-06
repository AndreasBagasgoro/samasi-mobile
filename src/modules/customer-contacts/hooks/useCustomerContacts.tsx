import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@shared/hooks';
import { customerContactService } from '../services/customer-contact.service';
import {
  ContactItem,
  CreateCustomerContactPayload,
  CustomerContactDetail,
  PaginationMeta,
  UpdateCustomerContactPayload,
} from '../types';
import { formatContact } from '../utils';

interface UseCustomerContactsOptions {
  autoFetch?: boolean;
  defaultLimit?: number;
}

export interface CreateContactResult {
  contact: CustomerContactDetail | null;
  errorMessage?: string;
}

// Cache halaman 1 tanpa pencarian agar saat kembali ke list tidak berkedip
let cachedContacts: ContactItem[] | null = null;
let cachedMeta: PaginationMeta | null = null;

export const useCustomerContacts = (
  options: UseCustomerContactsOptions = { autoFetch: true, defaultLimit: 10 }
) => {
  const { autoFetch = true, defaultLimit = 10 } = options;

  const [contacts, setContacts] = useState<ContactItem[]>(cachedContacts || []);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedQuery = useDebounce(searchQuery, 500);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagination, setPagination] = useState<PaginationMeta>(
    cachedMeta || { total: 0, page: 1, per_page: defaultLimit, total_pages: 1 }
  );

  const [isLoading, setIsLoading] = useState<boolean>(!(cachedContacts && cachedContacts.length > 0));
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = useCallback(
    async (search: string = debouncedQuery, page = 1) => {
      if (!cachedContacts || page > 1 || search !== '') {
        setIsLoading(true);
      }
      setError(null);

      try {
        const response = await customerContactService.getContacts({
          search,
          page,
          per_page: defaultLimit,
        });
        const formatted = response.data.map(formatContact);

        if (!search && page === 1) {
          cachedContacts = formatted;
          cachedMeta = response.meta;
        }

        setContacts(formatted);
        setPagination(response.meta);
        setCurrentPage(response.meta.page);
      } catch (err: any) {
        setError(err?.message || 'Gagal mengambil data kontak dari server.');
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedQuery, defaultLimit]
  );

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const goToPage = useCallback(
    (page: number) => {
      setCurrentPage(page);
      fetchContacts(debouncedQuery, page);
    },
    [fetchContacts, debouncedQuery]
  );

  const refreshContacts = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await customerContactService.getContacts({
        search: debouncedQuery,
        page: 1,
        per_page: defaultLimit,
      });
      const formatted = response.data.map(formatContact);

      if (!debouncedQuery) {
        cachedContacts = formatted;
        cachedMeta = response.meta;
      }

      setContacts(formatted);
      setPagination(response.meta);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err?.message || 'Gagal memperbarui data.');
    } finally {
      setIsRefreshing(false);
    }
  }, [debouncedQuery, defaultLimit]);

  const createContact = useCallback(
    async (payload: CreateCustomerContactPayload): Promise<CreateContactResult> => {
      setIsSaving(true);
      setError(null);
      try {
        const contact = await customerContactService.createContact(payload);
        // Invalidate cache agar list berikutnya mengambil data terbaru
        cachedContacts = null;
        cachedMeta = null;
        return { contact };
      } catch (err: any) {
        const errorMessage = err?.message || 'Gagal menambahkan kontak baru.';
        setError(errorMessage);
        return { contact: null, errorMessage };
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const updateContact = useCallback(
    async (id: string, payload: UpdateCustomerContactPayload): Promise<CreateContactResult> => {
      setIsSaving(true);
      setError(null);
      try {
        const contact = await customerContactService.updateContact(id, payload);
        cachedContacts = null;
        cachedMeta = null;
        return { contact };
      } catch (err: any) {
        const errorMessage = err?.message || 'Gagal memperbarui kontak.';
        setError(errorMessage);
        return { contact: null, errorMessage };
      } finally {
        setIsSaving(false);
      }
    },
    []
  );

  const deleteContact = useCallback(async (id: string): Promise<{ success: boolean; errorMessage?: string }> => {
    setIsSaving(true);
    setError(null);
    try {
      await customerContactService.deleteContact(id);
      cachedContacts = null;
      cachedMeta = null;
      return { success: true };
    } catch (err: any) {
      const errorMessage = err?.message || 'Gagal menghapus kontak.';
      setError(errorMessage);
      return { success: false, errorMessage };
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Fetch saat kata kunci (debounced) berubah
  useEffect(() => {
    if (autoFetch) {
      fetchContacts(debouncedQuery, 1);
    }
  }, [debouncedQuery, autoFetch, fetchContacts]);

  return {
    contacts,
    searchQuery,
    handleSearch,
    pagination,
    currentPage,
    goToPage,
    isLoading,
    isRefreshing,
    isSaving,
    error,
    setError,
    fetchContacts,
    refreshContacts,
    createContact,
    updateContact,
    deleteContact,
  };
};

export default useCustomerContacts;
