import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FormHeader } from '@shared/components';
import { Colors } from '@shared/constants';
import { ContactForm, ContactFormData } from '../components';
import { useCustomerContacts } from '../hooks';
import { customerContactService } from '../services/customer-contact.service';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EditContactScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { updateContact, isSaving } = useCustomerContacts({ autoFetch: false });

  const [formData, setFormData] = useState<ContactFormData | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    const load = async () => {
      try {
        const detail = await customerContactService.getContactDetail(id);
        if (!isMounted) return;
        setFormData({
          contact_name: detail.contact_name || '',
          customer_id: String(detail.customer_id),
          job_title: detail.job_title || '',
          phone_number: detail.phone_number || '',
          email: detail.email || '',
          is_primary: detail.is_primary ?? false,
        });
      } catch (err: any) {
        if (isMounted) setLoadError(err?.message || 'Gagal mengambil detail kontak.');
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  const validateForm = (data: ContactFormData) => {
    const newErrors: Record<string, string> = {};
    const name = data.contact_name.trim();
    const email = data.email.trim();

    if (!name) {
      newErrors.contact_name = 'Full name wajib diisi';
    } else if (name.length < 2) {
      newErrors.contact_name = 'Full name minimal 2 karakter';
    }
    if (!data.customer_id) {
      newErrors.customer_id = 'Customer wajib dipilih';
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!id || !formData || !validateForm(formData)) return;

    const email = formData.email.trim();
    const { contact, errorMessage } = await updateContact(id, {
      customer_id: formData.customer_id,
      contact_name: formData.contact_name.trim(),
      job_title: formData.job_title.trim(),
      phone_number: formData.phone_number.trim(),
      // Backend memvalidasi email sebagai format email, jadi string kosong tidak dikirim
      ...(email ? { email } : {}),
      is_primary: formData.is_primary,
    });

    if (contact) {
      router.back();
    } else {
      Alert.alert('Gagal', errorMessage || 'Gagal memperbarui kontak.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FormHeader title="Edit Contact" onSave={handleSave} isSaving={isSaving} />

      {formData ? (
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <ContactForm
            formData={formData}
            setFormData={setFormData as React.Dispatch<React.SetStateAction<ContactFormData>>}
            errors={errors}
            setErrors={setErrors}
          />
        </ScrollView>
      ) : (
        <View style={styles.stateContainer}>
          {loadError ? (
            <Text style={styles.errorText}>{loadError}</Text>
          ) : (
            <>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.stateText}>Memuat detail kontak...</Text>
            </>
          )}
        </View>
      )}

      {isSaving && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Menyimpan perubahan...</Text>
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
  stateContainer: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 8,
  },
  stateText: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  errorText: {
    fontSize: 13,
    color: Colors.semantic.error,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingBox: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 24,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.label,
  },
});

export default EditContactScreen;
