import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FormHeader } from '@shared/components';
import { CustomerForm, CustomerFormData } from '../components/CustomerForm';
import { Colors } from '@shared/constants';
import { useCustomers } from '@modules/customers/hooks';
import { useRouter } from 'expo-router';

export const AddCustomerScreen: React.FC = () => {
  const router = useRouter();
  const { createCustomer, isLoading, error } = useCustomers({ autoFetch: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<CustomerFormData>({
    customer_name: '',
    customer_code: '',
    customer_type_id: '',
    npwp: '',
    address: '',
    city: '',
    document_category_id: '',
    payment_terms_day: '',
  });
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

    const result = await createCustomer({
      customer_name: formData.customer_name.trim(),
      customer_code: formData.customer_code.trim() || undefined,
      customer_type_id: Number(formData.customer_type_id) || 1,
      npwp: formData.npwp.trim() || undefined,
      address: formData.address.trim() || undefined,
      city: formData.city.trim() || undefined,
      document_category_id: formData.document_category_id ? Number(formData.document_category_id) : undefined,
      payment_term_days: formData.payment_terms_day ? Number(formData.payment_terms_day) : 30,
    });

    if (result) {
      Alert.alert('Sukses', 'Customer berhasil ditambahkan!');
      router.back();
    }
  };

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