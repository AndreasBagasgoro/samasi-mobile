import React, { useState } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FormHeader } from '@shared/components';
import { CustomerForm, CustomerFormData } from '../components/CustomerForm';
import { CustomerSaveResult } from '../components/CustomerSaveResult';
import { Colors } from '@shared/constants';
import { useCustomers } from '@modules/customers/hooks';
import { CustomerDetailItem } from '../types';
import { useRouter } from 'expo-router';

const EMPTY_FORM: CustomerFormData = {
  customer_name: '',
  customer_code: '',
  customer_type_id: '',
  npwp: '',
  address: '',
  city: '',
  document_category_id: '',
  payment_terms_day: '',
};

interface SaveResultState {
  status: 'idle' | 'success' | 'error';
  customer?: CustomerDetailItem;
  errorMessage?: string;
}

export const AddCustomerScreen: React.FC = () => {
  const router = useRouter();
  const { createCustomer, isLoading } = useCustomers({ autoFetch: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CustomerFormData>(EMPTY_FORM);
  const [saveResult, setSaveResult] = useState<SaveResultState>({ status: 'idle' });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Customer Name wajib diisi';
    }
    if (!formData.customer_code.trim()) {
      newErrors.customer_code = 'Customer Code wajib diisi';
    }
    if (!formData.customer_type_id) {
      newErrors.customer_type_id = 'Customer Type wajib dipilih';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // True jika tidak ada error
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const { customer, errorMessage } = await createCustomer({
      customer_name: formData.customer_name.trim(),
      customer_code: formData.customer_code.trim() || undefined,
      customer_type_id: Number(formData.customer_type_id) || 1,
      npwp: formData.npwp.trim() || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      document_category_id: formData.document_category_id ? Number(formData.document_category_id) : undefined,
      payment_term_days: formData.payment_terms_day ? Number(formData.payment_terms_day) : 30,
    });

    setSaveResult(
      customer
        ? { status: 'success', customer }
        : { status: 'error', errorMessage }
    );
  };

  const handleViewCustomer = () => {
    if (saveResult.customer) {
      router.replace(`/home/customers/${saveResult.customer.customer_id}`);
    } else {
      router.replace('/home/customers');
    }
  };

  const handleCreateAnother = () => {
    setSaveResult({ status: 'idle' });
    setFormData(EMPTY_FORM);
    setErrors({});
  };

  const handleGoToCustomers = () => {
    router.replace('/home/customers');
  };

  const handleTryAgain = () => {
    setSaveResult({ status: 'idle' });
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home/customers');
    }
  };

  if (saveResult.status !== 'idle') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <CustomerSaveResult
          status={saveResult.status}
          customer={saveResult.customer}
          errorMessage={saveResult.errorMessage}
          onViewCustomer={handleViewCustomer}
          onCreateAnother={handleCreateAnother}
          onGoToCustomers={handleGoToCustomers}
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
        title="Add Customer"
        onSave={handleSave}
        isSaving={isLoading}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <CustomerForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
