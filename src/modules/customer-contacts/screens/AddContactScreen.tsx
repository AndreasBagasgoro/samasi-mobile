import React, { useState } from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { FormHeader, SaveResult } from '@shared/components';
import { Colors } from '@shared/constants';
import { ContactForm, ContactFormData } from '../components';
import { useCustomerContacts } from '../hooks';

const EMPTY_FORM: ContactFormData = {
  contact_name: '',
  customer_id: '',
  job_title: '',
  phone_number: '',
  email: '',
  is_primary: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SaveResultState {
  status: 'idle' | 'success' | 'error';
  contactId?: string;
  contactName?: string;
  errorMessage?: string;
}

export const AddContactScreen: React.FC = () => {
  const router = useRouter();
  const { createContact, isSaving } = useCustomerContacts({ autoFetch: false });

  const [formData, setFormData] = useState<ContactFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveResult, setSaveResult] = useState<SaveResultState>({ status: 'idle' });
  const [customerName, setCustomerName] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const name = formData.contact_name.trim();
    const email = formData.email.trim();

    if (!name) {
      newErrors.contact_name = 'Full name wajib diisi';
    } else if (name.length < 2) {
      newErrors.contact_name = 'Full name minimal 2 karakter';
    }
    if (!formData.customer_id) {
      newErrors.customer_id = 'Customer wajib dipilih';
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      newErrors.email = 'Format email tidak valid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const name = formData.contact_name.trim();
    const { contact, errorMessage } = await createContact({
      customer_id: formData.customer_id,
      contact_name: name,
      job_title: formData.job_title.trim() || undefined,
      phone_number: formData.phone_number.trim() || undefined,
      email: formData.email.trim() || undefined,
      is_primary: formData.is_primary,
    });

    if (contact) {
      setCustomerName(contact.customer_name || customerName);
      setSaveResult({
        status: 'success',
        contactId: String(contact.customer_contact_id),
        contactName: contact.contact_name || name,
      });
    } else {
      setSaveResult({ status: 'error', errorMessage });
    }
  };

  const handleNewContact = () => {
    setSaveResult({ status: 'idle' });
    setFormData(EMPTY_FORM);
    setErrors({});
  };

  const handleViewContact = () => {
    if (saveResult.contactId) {
      router.replace(`/home/customer-contacts/${saveResult.contactId}`);
    } else {
      router.replace('/home/customer-contacts');
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home/customer-contacts');
    }
  };

  if (saveResult.status === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <SaveResult
          status="success"
          title="Contact Saved!"
          message={
            <>
              <Text style={styles.messageBold}>{saveResult.contactName}</Text> has been added to your
              contacts.
            </>
          }
          summaryTitle="CONTACT SUMMARY"
          summaryRows={[
            { label: 'Name', value: saveResult.contactName },
            { label: 'Customer', value: customerName },
            { label: 'Phone', value: formData.phone_number.trim() },
          ]}
          primaryAction={{ label: 'View Contact', icon: 'person-outline', onPress: handleViewContact }}
          secondaryAction={{ label: 'New Contact', icon: 'add', onPress: handleNewContact }}
          tertiaryAction={{
            label: 'Back to Contacts',
            onPress: () => router.replace('/home/customer-contacts'),
          }}
        />
      </SafeAreaView>
    );
  }

  if (saveResult.status === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <SaveResult
          status="error"
          title="Something went wrong"
          message="We couldn't save this contact. Please check the details and try again."
          errorDetail={saveResult.errorMessage}
          primaryAction={{
            label: 'Try Again',
            icon: 'refresh',
            onPress: () => setSaveResult({ status: 'idle' }),
          }}
          secondaryAction={{ label: 'Go Back', onPress: handleGoBack }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <FormHeader title="Add Contact" onSave={handleSave} isSaving={isSaving} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <ContactForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          onCustomerChange={setCustomerName}
        />
      </ScrollView>

      {isSaving && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Menyimpan kontak...</Text>
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
  messageBold: {
    fontWeight: '600',
    color: Colors.text.primary,
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
