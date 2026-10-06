import React, { useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  ActivityIndicator,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FormHeader } from '@shared/components';
import { Colors } from '@shared/constants';
import { useRouter } from 'expo-router';
import { DiaryForm, DiaryFormData } from '../components/DiaryForm';
import { DiarySaveResult } from '../components/DiarySaveResult';
import { useDiary } from '../hooks';
import { diaryService } from '../services/diary.service';
import { useCustomers } from '@modules/customers';

interface SaveResult {
  status: 'idle' | 'success' | 'error';
  diaryId?: string;
  errorMessage?: string;
}

export const AddDiaryScreen: React.FC = () => {
  const router = useRouter();
  const { createDiary, isLoading } = useDiary({ autoFetch: false });
  const { formattedCustomers } = useCustomers({ autoFetch: false });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveResult, setSaveResult] = useState<SaveResult>({ status: 'idle' });
  const [formData, setFormData] = useState<DiaryFormData>({
    title: '',
    customer_id: '',
    customer_contact_id: '',
    interaction_type: 'VISIT',
    interaction_type_id: '1',
    notes: '',
    latitude: undefined,
    longitude: undefined,
    location_name: '',
    captured_at: undefined,
    geocoded_at: undefined,
    accuracy: null,
    is_mocked: false,
    photos: [],
    photo_metadata: {},
  });

  const selectedCustomer = formattedCustomers.find(
    (c) => String(c.id) === String(formData.customer_id)
  );
  const customerName = selectedCustomer?.name || 'Customer';

  // Save diblokir jika lokasi entri belum di-capture / Fake GPS,
  // atau ada foto yang terdeteksi Fake GPS (foto sendiri tidak wajib)
  const hasEntryLocation = formData.latitude != null && formData.longitude != null;
  const isEntryLocationMocked = hasEntryLocation && !!formData.is_mocked;
  const hasMockedPhoto = formData.photos.some(
    (uri) => !!formData.photo_metadata?.[uri]?.is_mocked
  );
  const isSaveBlocked = !hasEntryLocation || isEntryLocationMocked || hasMockedPhoto;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer wajib dipilih';
    }
    if (!formData.customer_contact_id) {
      newErrors.customer_contact_id = 'Contact (PIC) wajib dipilih';
    }
    if (!formData.interaction_type) {
      newErrors.interaction_type = 'Interaction Type wajib dipilih';
    }
    if (!formData.notes.trim()) {
      newErrors.notes = 'Notes wajib diisi';
    }
    if (!hasEntryLocation) {
      newErrors.location = 'Lokasi wajib di-capture';
    } else if (isEntryLocationMocked) {
      newErrors.location = 'Lokasi terdeteksi Fake GPS, perbarui lokasi terlebih dahulu';
    }
    if (hasMockedPhoto) {
      newErrors.photos = 'Hapus foto yang terdeteksi Fake GPS terlebih dahulu';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const titleToSend =
      formData.title.trim() || `${customerName} - ${formData.interaction_type}`;

    const standardUrlPhotos = (formData.photos || []).filter(
      (url) => url.startsWith('http://') || url.startsWith('https://')
    );
    const localWatermarkedPhotos = (formData.photos || []).filter(
      (url) => !url.startsWith('http://') && !url.startsWith('https://')
    );

    const result = await createDiary({
      customer_contact_id:
        Number(formData.customer_contact_id) || formData.customer_contact_id,
      interaction_type_id: Number(formData.interaction_type_id) || 1,
      title: titleToSend,
      notes: formData.notes.trim(),
      entry_at: new Date().toISOString(),
      latitude: formData.latitude,
      longitude: formData.longitude,
      location_name: formData.location_name || undefined,
      captured_at: formData.captured_at,
      geocoded_at: formData.geocoded_at,
      accuracy: formData.accuracy ?? null,
      is_mocked: formData.is_mocked ?? false,
      ...(standardUrlPhotos.length > 0
        ? {
            photos: standardUrlPhotos.map((url) => ({
              photo_url: url,
              caption: `Photo for ${customerName}`,
              latitude: formData.latitude,
              longitude: formData.longitude,
            })),
          }
        : {}),
    });

    if (result) {
      const diaryId = String(
        (result as any).sales_diary_entry_id ||
          (result as any).id ||
          ''
      );

      // Upload local watermarked photos satu per satu agar metadata lokasi
      // (termasuk accuracy & is_mocked) tersimpan per foto
      if (diaryId && localWatermarkedPhotos.length > 0) {
        for (const photoUri of localWatermarkedPhotos) {
          const meta = formData.photo_metadata?.[photoUri];
          try {
            await diaryService.uploadDiaryPhotos(diaryId, [photoUri], {
              caption: `Selfie & Evidence for ${customerName}`,
              latitude: meta?.latitude,
              longitude: meta?.longitude,
              captured_at: meta?.captured_at,
              location_name: meta?.location_name,
              geocoded_at: meta?.geocoded_at,
              accuracy: meta?.accuracy ?? null,
              is_mocked: meta?.is_mocked ?? false,
            });
          } catch (uploadErr) {
            console.warn('Gagal mengunggah foto selfie ke server:', uploadErr);
          }
        }
      }

      setSaveResult({
        status: 'success',
        diaryId,
      });
    } else {
      setSaveResult({
        status: 'error',
        errorMessage: '500 Internal Server Error',
      });
    }
  };

  const handleViewTimeline = () => {
    if (saveResult.diaryId) {
      router.replace(`/home/diary/${saveResult.diaryId}`);
    } else {
      router.replace('/home/diary');
    }
  };

  const handleNewEntry = () => {
    setSaveResult({ status: 'idle' });
    setFormData({
      title: '',
      customer_id: '',
      customer_contact_id: '',
      interaction_type: 'VISIT',
      interaction_type_id: '1',
      notes: '',
      latitude: undefined,
      longitude: undefined,
      location_name: '',
      captured_at: undefined,
      geocoded_at: undefined,
      accuracy: null,
      is_mocked: false,
      photos: [],
      photo_metadata: {},
    });
    setErrors({});
  };

  const handleGoToDashboard = () => {
    router.replace('/home');
  };

  const handleTryAgain = () => {
    setSaveResult({ status: 'idle' });
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home/diary');
    }
  };

  // Show result screen (success or error)
  if (saveResult.status !== 'idle') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <DiarySaveResult
          status={saveResult.status}
          data={{
            customerName,
            interactionType: formData.interaction_type,
            diaryId: saveResult.diaryId,
            errorMessage: saveResult.errorMessage,
          }}
          onViewTimeline={handleViewTimeline}
          onNewEntry={handleNewEntry}
          onGoToDashboard={handleGoToDashboard}
          onTryAgain={handleTryAgain}
          onGoBack={handleGoBack}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FormHeader
        title="New Diary"
        onSave={handleSave}
        isSaving={isLoading}
        saveDisabled={isSaveBlocked}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <DiaryForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onSubmit={handleSave}
          isSaving={isLoading}
        />
      </ScrollView>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Menyimpan diary...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});

export default AddDiaryScreen;