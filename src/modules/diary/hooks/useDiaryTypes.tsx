import { useState, useEffect, useCallback } from 'react';
import { diaryService } from '../services/diary.service';
import { DiaryInteractionTypeNameItem } from '../types';

interface UseDiaryTypesOptions {
    autoFetch?: boolean;
}

let cachedDiaryTypes: DiaryInteractionTypeNameItem[] | null = null;
let cachedFormattedDiaryTypes: DiaryInteractionTypeNameItem[] | null = null;

export const useDiaryTypes = (options: UseDiaryTypesOptions = { autoFetch: true }) => {
    const { autoFetch = true } = options;

    const [diaryTypes, setDiaryTypes] = useState<DiaryInteractionTypeNameItem[]>(cachedDiaryTypes || []);
    const [formattedDiaryTypes, setFormattedDiaryTypes] = useState<DiaryInteractionTypeNameItem[]>(cachedFormattedDiaryTypes || []);

    const hasInitialData = Boolean(cachedFormattedDiaryTypes && cachedFormattedDiaryTypes.length > 0);
    const [isLoading, setIsLoading] = useState<boolean>(!hasInitialData);
    const [error, setError] = useState<string | null>(null);

    const formatDiaryTypeData = useCallback((data: DiaryInteractionTypeNameItem[]): DiaryInteractionTypeNameItem[] => {
        return (data || [])
            .filter((item: any) => item.interaction_type_id != null || item.id != null)
            .map((item: any) => ({
                interaction_type_id: item.interaction_type_id ?? item.id,
                interaction_type_name: (item.interaction_type_name || item.name || 'General').toUpperCase(),
            }));
    }, []);

    useEffect(() => {
        if (!autoFetch) return;
        if (cachedFormattedDiaryTypes && cachedFormattedDiaryTypes.length > 0) return;

        let isMounted = true;

        const loadDiaryTypes = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await diaryService.getDiaryInteractionTypeNames();
                console.log('[DEBUG useDiaryTypes] raw response.data:', JSON.stringify(response.data, null, 2));
                const formatted = formatDiaryTypeData(response.data);
                console.log('[DEBUG useDiaryTypes] formatted:', JSON.stringify(formatted, null, 2));

                cachedDiaryTypes = response.data;
                cachedFormattedDiaryTypes = formatted;

                if (isMounted) {
                    setDiaryTypes(response.data);
                    setFormattedDiaryTypes(formatted);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err?.message || 'Gagal mengambil data tipe diary dari server.');
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadDiaryTypes();

        return () => {
            isMounted = false;
        };
    }, [autoFetch, formatDiaryTypeData]);

    return {
        diaryTypes,
        formattedDiaryTypes,
        isLoading,
        error,
        setError,
    };
};

export default useDiaryTypes;



