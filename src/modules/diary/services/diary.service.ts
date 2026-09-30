import { mobileApiService } from "@shared/services";
import {
    DiaryEntryItem,
    DiaryListParams,
    DiaryEntryListResponse,
    DiaryInteractionTypeNameResponse,
    CreateDiaryPayload,
    UpdateDiaryPayload,
    DeleteDiaryResponse,
} from "../types";

export const diaryService = {
    async createDiary(payload: CreateDiaryPayload): Promise<DiaryEntryItem> {
        const response = await mobileApiService.post<DiaryEntryItem>('/diary', payload);
        return response.data;
    },

    async getDiaries(params?: DiaryListParams): Promise<DiaryEntryListResponse> {
        const queryParams: Record<string, string> = {};
        if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
        if (params?.page !== undefined) queryParams.page = String(params.page);
        if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);
        if (params?.interaction_type_id && params.interaction_type_id !== 'all') {
            queryParams.interaction_type_id = String(params.interaction_type_id);
        }
        if (params?.customer_id) queryParams.customer_id = String(params.customer_id);
        if (params?.customer_contact_id) queryParams.customer_contact_id = String(params.customer_contact_id);
        if (params?.employee_id) queryParams.employee_id = String(params.employee_id);
        if (params?.start_date) queryParams.start_date = params.start_date;
        if (params?.end_date) queryParams.end_date = params.end_date;

        const raw = await mobileApiService.get<any>('/diary', queryParams) as any;

        return {
            success: raw?.success ?? true,
            code: raw?.code,
            message: raw?.message,
            data: raw?.data ?? [],
            meta: {
                page: raw?.meta?.page ?? 1,
                per_page: raw?.meta?.per_page ?? params?.per_page ?? 10,
                total: raw?.meta?.total ?? 0,
                total_pages: raw?.meta?.total_pages ?? 1,
            },
        };
    },

    async getDiaryById(id: string | number): Promise<DiaryEntryItem> {
        const response = await mobileApiService.get<DiaryEntryItem>(`/diary/${id}`);
        return response.data;
    },

    async updateDiary(id: string | number, payload: UpdateDiaryPayload): Promise<DiaryEntryItem> {
        const response = await mobileApiService.put<DiaryEntryItem>(`/diary/${id}`, payload);
        return response.data;
    },

    async deleteDiary(id: string | number): Promise<DeleteDiaryResponse> {
        const response = await mobileApiService.delete<any>(`/diary/${id}`);
        return {
            success: response?.success ?? true,
            message: response?.message || 'Diary entry berhasil dihapus',
        };
    },

    async getDiaryInteractionTypeNames(params?: DiaryListParams): Promise<DiaryInteractionTypeNameResponse> {
        const queryParams: Record<string, string> = {};
        if (params?.search && params.search.trim()) queryParams.search = params.search.trim();
        if (params?.page !== undefined) queryParams.page = String(params.page);
        if (params?.per_page !== undefined) queryParams.per_page = String(params.per_page);

        const raw = await mobileApiService.get('/diary/interaction-types', queryParams) as any;
        return {
            data: raw.data ?? [],
            meta: {
                page: raw.meta?.page ?? 1,
                per_page: raw.meta?.per_page ?? params?.per_page ?? 10,
                total: raw.meta?.total ?? 0,
                total_pages: raw.meta?.total_pages ?? 1,
            },
        };
    },

    async uploadDiaryPhotos(
        id: string | number,
        photos: (string | { uri: string; name?: string; type?: string })[],
        metadata?: { caption?: string; latitude?: number; longitude?: number }
    ): Promise<any> {
        const formData = new FormData();

        for (let i = 0; i < photos.length; i++) {
            const item = photos[i];
            const uri = typeof item === 'string' ? item : item.uri;
            const fileName = (typeof item === 'object' && item.name) ? item.name : `selfie_${Date.now()}_${i}.jpg`;
            const mimeType = (typeof item === 'object' && item.type) ? item.type : 'image/jpeg';

            try {
                let blob: Blob;

                if (uri.startsWith('data:')) {
                    try {
                        const res = await fetch(uri);
                        blob = await res.blob();
                    } catch {
                        // Fallback jika fetch data-uri gagal
                        const splitIndex = uri.indexOf(',');
                        const header = uri.substring(0, splitIndex);
                        const base64Data = uri.substring(splitIndex + 1);
                        const mime = header.match(/:(.*?);/)?.[1] || mimeType;
                        const byteCharacters = atob(base64Data);
                        const byteNumbers = new Uint8Array(byteCharacters.length);
                        for (let b = 0; b < byteCharacters.length; b++) {
                            byteNumbers[b] = byteCharacters.charCodeAt(b);
                        }
                        blob = new Blob([byteNumbers], { type: mime });
                    }
                } else {
                    const res = await fetch(uri);
                    blob = await res.blob();
                }

                try {
                    Object.defineProperty(blob, 'name', {
                        value: fileName,
                        writable: true,
                        configurable: true,
                        enumerable: true,
                    });
                } catch {
                }

                if (!blob.type || blob.type === 'application/octet-stream') {
                    try {
                        Object.defineProperty(blob, 'type', {
                            value: mimeType,
                            writable: true,
                            configurable: true,
                            enumerable: true,
                        });
                    } catch {
                    }
                }

                formData.append('photos', blob, fileName);
            } catch (fetchErr) {
                console.error('[uploadDiaryPhotos] Gagal menyiapkan photo blob:', fetchErr);
                throw fetchErr;
            }
        }

        if (metadata?.caption) formData.append('caption', metadata.caption);
        if (metadata?.latitude) formData.append('latitude', String(metadata.latitude));
        if (metadata?.longitude) formData.append('longitude', String(metadata.longitude));

        return mobileApiService.postMultipart(`/diary/${id}/photos/upload`, formData);
    },
};
