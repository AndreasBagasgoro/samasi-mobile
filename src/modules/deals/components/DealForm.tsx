import React, { useEffect, useMemo, useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Colors, Layout } from '@shared/constants';
import { Dropdown } from '@shared/components';
import {
  customerService,
  CustomerContactSummaryItem,
  CustomerSummaryItem,
} from '@modules/customers';
import { DEAL_CURRENCY } from '../constants/deal.constants';
import { PipelineStageItem } from '../types';
import { formatNumberInput } from '../utils';
import { StageSelector } from './StageSelector';
import { DatePickerField } from './DatePickerField';

export interface DealFormData {
  title: string;
  customer_id: string;
  customer_contact_id: string;
  /** Hanya digit, mis. "48000" */
  estimated_value: string;
  sales_pipeline_stage_id: string;
  /** Format YYYY-MM-DD */
  expected_close_date: string | null;
  notes: string;
}

export interface DealFormProps {
  formData: DealFormData;
  setFormData: React.Dispatch<React.SetStateAction<DealFormData>>;
  stages: PipelineStageItem[];
  errors?: Record<string, string>;
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const CUSTOMER_OPTION_LIMIT = 100;

export const DealForm: React.FC<DealFormProps> = ({
  formData,
  setFormData,
  stages,
  errors,
  setErrors,
}) => {
  const [customers, setCustomers] = useState<CustomerSummaryItem[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [contacts, setContacts] = useState<CustomerContactSummaryItem[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);

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

  useEffect(() => {
    if (!formData.customer_id) {
      setContacts([]);
      return;
    }

    let isMounted = true;
    const loadCustomerContacts = async () => {
      setIsLoadingContacts(true);
      try {
        const data = await customerService.getCustomerContact(formData.customer_id);
        if (isMounted) setContacts(data || []);
      } catch {
        if (isMounted) setContacts([]);
      } finally {
        if (isMounted) setIsLoadingContacts(false);
      }
    };
    loadCustomerContacts();
    return () => {
      isMounted = false;
    };
  }, [formData.customer_id]);

  const customerOptions = useMemo(
    () =>
      customers.map((customer) => ({
        label: customer.customer_name,
        value: String(customer.customer_id),
      })),
    [customers]
  );

  const contactOptions = useMemo(
    () =>
      contacts.map((contact) => ({
        label: contact.job_title
          ? `${contact.contact_name} — ${contact.job_title}`
          : contact.contact_name,
        value: String(contact.customer_contact_id),
      })),
    [contacts]
  );

  const updateField = <K extends keyof DealFormData>(key: K, value: DealFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors?.[key]) {
      setErrors?.((prev) => ({ ...prev, [key]: '' }));
    }
  };

  const handleSelectCustomer = (val: string | number) => {
    setFormData((prev) => ({
      ...prev,
      customer_id: String(val),
      customer_contact_id: '', // Reset kontak saat customer berganti
    }));
    if (errors?.customer_id) {
      setErrors?.((prev) => ({ ...prev, customer_id: '' }));
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>
          DEAL TITLE <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <TextInput
          style={[styles.textInput, errors?.title ? styles.inputError : null]}
          placeholder="e.g. FCL Shanghai Monthly Contract"
          placeholderTextColor="#94A3B8"
          value={formData.title}
          onChangeText={(text) => updateField('title', text)}
          maxLength={200}
        />
        {errors?.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>
          CUSTOMER <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <Dropdown
          placeholder={isLoadingCustomers ? 'Memuat customer...' : 'Select customer...'}
          items={customerOptions}
          selectedValue={formData.customer_id}
          onValueChange={handleSelectCustomer}
          error={errors?.customer_id}
          showSearch={true}
          modalTitle="Pilih Customer"
          containerStyle={styles.dropdown}
        />
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>
          CONTACT (PIC) <Text style={styles.requiredAsterisk}>*</Text>
        </Text>
        <Dropdown
          placeholder={
            !formData.customer_id
              ? 'Pilih Customer terlebih dahulu'
              : isLoadingContacts
              ? 'Memuat kontak...'
              : contacts.length === 0
              ? 'Customer belum memiliki kontak'
              : 'Select contact...'
          }
          items={contactOptions}
          selectedValue={formData.customer_contact_id}
          onValueChange={(val) => updateField('customer_contact_id', String(val))}
          disabled={!formData.customer_id || isLoadingContacts}
          error={errors?.customer_contact_id}
          modalTitle="Pilih Contact (PIC)"
          containerStyle={styles.dropdown}
        />
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>ESTIMATED VALUE ({DEAL_CURRENCY})</Text>
        <TextInput
          style={[styles.textInput, errors?.estimated_value ? styles.inputError : null]}
          placeholder="48,000"
          placeholderTextColor="#94A3B8"
          keyboardType="number-pad"
          value={formatNumberInput(formData.estimated_value)}
          onChangeText={(text) => updateField('estimated_value', text.replace(/\D/g, ''))}
        />
        {errors?.estimated_value ? (
          <Text style={styles.errorText}>{errors.estimated_value}</Text>
        ) : null}
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>STAGE</Text>
        <StageSelector
          stages={stages}
          selectedStageId={formData.sales_pipeline_stage_id}
          onSelect={(stage) => updateField('sales_pipeline_stage_id', stage.sales_pipeline_stage_id)}
        />
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>EXPECTED CLOSE DATE</Text>
        <DatePickerField
          value={formData.expected_close_date}
          onChange={(date) => updateField('expected_close_date', date)}
          placeholder="Select date..."
        />
      </View>

      <View style={styles.fieldSection}>
        <Text style={styles.fieldTitle}>NOTES</Text>
        <TextInput
          style={styles.notesInput}
          placeholder="Additional deal context..."
          placeholderTextColor="#94A3B8"
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={formData.notes}
          onChangeText={(text) => updateField('notes', text)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPaddingHorizontal2,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },
  fieldSection: {
    gap: 6,
  },
  fieldTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 0.5,
  },
  requiredAsterisk: {
    color: Colors.semantic.error,
  },
  errorText: {
    fontSize: 12,
    color: Colors.semantic.error,
    marginTop: 2,
    marginLeft: 2,
  },
  dropdown: {
    marginBottom: 0,
  },
  textInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    fontSize: 13.5,
    color: '#0F172A',
    outlineStyle: 'none',
  } as any,
  inputError: {
    borderColor: Colors.semantic.error,
  },
  notesInput: {
    minHeight: 110,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 13.5,
    color: '#0F172A',
    outlineStyle: 'none',
  } as any,
});
