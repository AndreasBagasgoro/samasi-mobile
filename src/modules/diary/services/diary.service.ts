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
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';       
import { File as ExpoFile } from 'expo-file-system'; 

type DiaryPhotoInput = string | { uri: string; name?: string; type?: string };

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
        photos: DiaryPhotoInput[],
        metadata?: {
            caption?: string;
            latitude?: number;
            longitude?: number;
            captured_at?: string;
            location_name?: string;
            geocoded_at?: string;
            accuracy?: number | null;
            is_mocked?: boolean;
        }
    ): Promise<any> {
        const formData = new FormData();

        for (let i = 0; i < photos.length; i++) {
            const item = photos[i];
            let uri = typeof item === 'string' ? item : item.uri;
            const fileName =
                typeof item === 'object' && item.name ? item.name : `selfie_${Date.now()}_${i}.jpg`;
            const mimeType =
                typeof item === 'object' && item.type ? item.type : 'image/jpeg';

            if (Platform.OS === 'web') {
                // Web: Blob/File standar sudah benar
                const blob = await (await fetch(uri)).blob();
                formData.append('photos', new File([blob], fileName, { type: mimeType }));
            } else {
                // Native: data URI (base64) -> tulis ke file cache dulu
                if (uri.startsWith('data:')) {
                    const base64Data = uri.substring(uri.indexOf(',') + 1);
                    const path = `${FileSystem.cacheDirectory}${fileName}`;
                    await FileSystem.writeAsStringAsync(path, base64Data, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
                    uri = path; // sudah berawalan file://
                } else if (!uri.startsWith('file://') && !uri.startsWith('content://')) {
                    uri = `file://${uri}`;
                }

                // ExpoFile adalah turunan Blob yang membaca byte langsung dari native,
                // sehingga diterima oleh expo/fetch dan isinya tidak korup.
                const file = new ExpoFile(uri);
                formData.append('photos', file as any, fileName);
            }
        }

        if (metadata?.caption) formData.append('caption', metadata.caption);
        if (metadata?.latitude !== undefined) formData.append('latitude', String(metadata.latitude));
        if (metadata?.longitude !== undefined) formData.append('longitude', String(metadata.longitude));
        if (metadata?.captured_at) formData.append('captured_at', metadata.captured_at);
        if (metadata?.location_name) formData.append('location_name', metadata.location_name);
        if (metadata?.geocoded_at) formData.append('geocoded_at', metadata.geocoded_at);
        if (metadata?.accuracy != null) formData.append('accuracy', String(metadata.accuracy));
        if (metadata?.is_mocked !== undefined) formData.append('is_mocked', String(metadata.is_mocked));

        return mobileApiService.postMultipart(`/diary/${id}/photos/upload`, formData);
    },
};