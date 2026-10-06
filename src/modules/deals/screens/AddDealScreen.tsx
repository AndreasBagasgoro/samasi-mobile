import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormHeader } from '@shared/components';
import { Colors } from '@shared/constants';
import { DealForm, DealFormData, DealSaveResult } from '../components';
import { useDeals, usePipelineStages, useStageColors } from '../hooks';
import { CreateDealPayload, DealItem } from '../types';

const EMPTY_FORM: DealFormData = {
  title: '',
  customer_id: '',
  customer_contact_id: '',
  estimated_value: '',
  sales_pipeline_stage_id: '',
  expected_close_date: null,
  notes: '',
};

interface SaveResultState {
  status: 'idle' | 'success' | 'error';
  deal?: DealItem;
  errorMessage?: string;
}

export const AddDealScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditMode = Boolean(id);
  const router = useRouter();
  const { stages } = usePipelineStages();
  const stageColors = useStageColors(stages);
  const { createDeal, updateDeal, fetchDealDetail, isSaving } = useDeals({ autoFetch: false });

  const [formData, setFormData] = useState<DealFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingDeal, setIsLoadingDeal] = useState(isEditMode);
  const [saveResult, setSaveResult] = useState<SaveResultState>({ status: 'idle' });
  const hasPrefilled = useRef(false);

  // Default stage untuk deal baru: stage aktif pertama di pipeline
  useEffect(() => {
    if (isEditMode || formData.sales_pipeline_stage_id || stages.length === 0) return;
    const firstActiveStage = stages.find((stage) => !stage.is_won_stage && !stage.is_lost_stage) || stages[0];
    setFormData((prev) => ({ ...prev, sales_pipeline_stage_id: firstActiveStage.sales_pipeline_stage_id }));
  }, [isEditMode, stages, formData.sales_pipeline_stage_id]);

  useEffect(() => {
    if (!id || hasPrefilled.current) return;
    hasPrefilled.current = true;

    fetchDealDetail(id).then((deal) => {
      if (deal) {
        setFormData({
          title: deal.title,
          customer_id: deal.customerId || '',
          customer_contact_id: deal.customerContactId,
          estimated_value: deal.value ? String(Math.round(deal.value)) : '',
          sales_pipeline_stage_id: deal.stageId,
          expected_close_date: deal.expectedCloseDate || null,
          notes: deal.notes || '',
        });
      }
      setIsLoadingDeal(false);
    });
  }, [id, fetchDealDetail]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title wajib diisi';
    }
    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer wajib dipilih';
    }
    if (!formData.customer_contact_id) {
      newErrors.customer_contact_id = 'Contact (PIC) wajib dipilih';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const payload: CreateDealPayload = {
      title: formData.title.trim(),
      customer_contact_id: formData.customer_contact_id,
      sales_pipeline_stage_id: formData.sales_pipeline_stage_id || undefined,
      estimated_value: formData.estimated_value ? Number(formData.estimated_value) : 0,
      expected_close_date: formData.expected_close_date,
      notes: formData.notes.trim() || null,
    };

    const result = id ? await updateDeal(id, payload) : await createDeal(payload);

    if (isEditMode) {
      if (!result) {
        Alert.alert(
          'Gagal Memperbarui Deal',
          'Terjadi kesalahan saat menyimpan deal. Silakan coba lagi.'
        );
        return;
      }
      router.back();
      return;
    }

    setSaveResult(
      result
        ? { status: 'success', deal: result }
        : { status: 'error' }
    );
  };

  const handleViewDeal = () => {
    if (saveResult.deal) {
      router.replace(`/home/deals/${saveResult.deal.id}`);
    } else {
      router.replace('/home/deals');
    }
  };

  const handleCreateAnother = () => {
    setSaveResult({ status: 'idle' });
    setFormData(EMPTY_FORM);
    setErrors({});
  };

  const handleGoToPipeline = () => {
    router.replace('/home/deals');
  };

  const handleTryAgain = () => {
    setSaveResult({ status: 'idle' });
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home/deals');
    }
  };

  if (saveResult.status !== 'idle') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <DealSaveResult
          status={saveResult.status}
          deal={saveResult.deal}
          stageColor={saveResult.deal ? stageColors.get(saveResult.deal.stageId) : undefined}
          errorMessage={saveResult.errorMessage}
          onViewDeal={handleViewDeal}
          onCreateAnother={handleCreateAnother}
          onGoToPipeline={handleGoToPipeline}
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
        title={isEditMode ? 'Edit Deal' : 'Create Deal'}
        onSave={handleSave}
        isSaving={isSaving}
        saveDisabled={isLoadingDeal}
      />

      {isLoadingDeal ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Memuat data deal...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <DealForm
            formData={formData}
            setFormData={setFormData}
            stages={stages}
            errors={errors}
            setErrors={setErrors}
          />
        </ScrollView>
      )}

      {isSaving && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingBoxText}>Menyimpan deal...</Text>
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
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.text.secondary,
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
  loadingBoxText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});

export default AddDealScreen;
