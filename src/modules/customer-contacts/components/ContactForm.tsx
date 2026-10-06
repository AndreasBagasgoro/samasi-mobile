import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, Switch } from 'react-native';
import { Colors, Layout } from '@shared/constants';
import { Dropdown, Input } from '@shared/components';
import { customerService, CustomerSummaryItem } from '@modules/customers';

export interface ContactFormData {
  contact_name: string;
  customer_id: string;
  job_title: string;
  phone_number: string;
  email: string;
  is_primary: boolean;
}

export interface ContactFormProps {
  formData: ContactFormData;
  setFormData: React.Dispatch<React.SetStateAction<ContactFormData>>;
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onCustomerChange?: (customerName: string) => void;
}

const CUSTOMER_OPTION_LIMIT = 100;

export const ContactForm: React.FC<ContactFormProps> = ({
  formData,
  setFormData,
  errors,
  setErrors,
  onCustomerChange,
}) => {
  const [customers, setCustomers] = useState<CustomerSummaryItem[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadCustomers = async () => {
      setIsLoadingCustomers(true);
      try {
        const response = await customerService.getCustomers({ page: 1, per_page: CUSTOMER_OPTION_LIMIT });
        if (isMounted) setCustomers(response.data);
      } catch {
        if (isMounted) setCustomers([]);
      } finally {
        if (isMounted) setIsLoadingCustomers(false);
      }
    };
    loadCustomers();
    return () => {
      isMounted = false;
    };
  }, []);

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        label: customer.customer_name,
        value: String(customer.customer_id),
      })),
    [customers]
  );

  const updateField = <K extends keyof ContactFormData>(key: K, value: ContactFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors?.[key]) {
      setErrors?.((prev) => ({ ...prev, [key]: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.fieldTitle}>
          FULL NAME <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <Input
          placeholder="James Tan Wei Ming"
          value={formData.contact_name}
          onChangeText={(text) => updateField('contact_name', text)}
          maxLength={150}
          inputContainerStyle={styles.inputContainerStyle}
          error={errors?.contact_name}
        />
      </View>

      <View>
        <Text style={styles.fieldTitle}>
          CUSTOMER <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <Dropdown
          placeholder={isLoadingCustomers ? 'Memuat customer...' : 'Select customer...'}
          items={customerOptions}
          selectedValue={formData.customer_id}
          onValueChange={(val) => {
            updateField('customer_id', String(val));
            const selected = customerOptions.find((option) => option.value === String(val));
            onCustomerChange?.(selected?.label ?? '');
          }}
          error={errors?.customer_id}
          showSearch={true}
          modalTitle="Pilih Customer"
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>

      <View>
        <Text style={styles.fieldTitle}>JOB TITLE</Text>
        <Input
          placeholder="Sales Director"
          value={formData.job_title}
          onChangeText={(text) => updateField('job_title', text)}
          maxLength={100}
          inputContainerStyle={styles.inputContainerStyle}
        />
      </View>

      <View>
        <Text style={styles.fieldTitle}>PHONE</Text>
        <Input
          placeholder="+65 9123 4567"
          keyboardType="phone-pad"
          value={formData.phone_number}
          onChangeText={(text) => updateField('phone_number', text)}
          maxLength={50}
          inputContainerStyle={styles.inputContainerStyle}
          error={errors?.phone_number}
        />
      </View>

      <View>
        <Text style={styles.fieldTitle}>EMAIL</Text>
        <Input
          placeholder="james.tan@company.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          maxLength={150}
          inputContainerStyle={styles.inputContainerStyle}
          error={errors?.email}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.switchTitle}>Primary Contact</Text>
          <Text style={styles.switchHint}>Jadikan kontak utama untuk customer ini</Text>
        </View>
        <Switch
          value={formData.is_primary}
          onValueChange={(value) => updateField('is_primary', value)}
          trackColor={{ false: Colors.border, true: Colors.primaryLight }}
          thumbColor={Colors.surface}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Colors.surface,
    paddingHorizontal: Layout.containerPaddingHorizontal,
    paddingVertical: 28,
  },
  fieldTitle: {
    fontSize: 11,
    letterSpacing: 0.8,
    color: Colors.text.label,
    fontWeight: '700',
    marginBottom: 8,
    marginLeft: 4,
  },
  requiredAsterisk: {
    color: Colors.semantic.error,
  },
  inputContainerStyle: {
    borderRadius: 14,
    backgroundColor: Colors.background,
    borderColor: Colors.border,
    borderWidth: 1.5,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  switchText: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  switchHint: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});
