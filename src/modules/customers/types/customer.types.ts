import React from 'react';

export interface FilterItem {
    id?: string;
    label: string;
    value: string;
    selected: boolean;
    onPress?: () => void;
}

export interface CustomerItem {
    id?: string;
    profileInitial: string;
    name: string;
    customerType: string;
    totalContacts: number;
    lastActive: string;
    avatarBackgroundColor?: string;
    avatarTextColor?: string;
    status?: 'active' | 'inactive' | string;
    npwp?: string;
    email?: string;
    address?: string;
    billingAddress?: string;
    city?: string;
    paymentTermDays?: number;
    approvalStatus?: string;
    documentCategory?: string;
    createdBy?: string;
    onPress?: () => void;
}

export interface DealItem {
    id?: string;
    title: string;
    amount: string;
    stage: string;
    date?: string;
    onPress?: () => void;
}

export interface CustomerSummaryItem {
  customer_id: string | number;
  customer_code: string;
  customer_name: string;
  short_name: string;
  customer_type_id: string | number;
  customer_type_name: string;
  status: 'ACTIVE' | 'INACTIVE';
  created_at?: string;
}

export interface CustomerDetailItem extends CustomerSummaryItem {
  npwp?: string | null;
  email?: string | null;
  address?: string | null;
  billing_address?: string | null;
  city_name?: string | null;
  document_category_name?: string | null;
  payment_term_days: number;
  approval_status: string;
  is_approved_for_transaction: boolean;
  created_by_name?: string | null;
  updated_by_name?: string | null;
  customerContact?: Array<{
    contactId: string | number;
    contactName: string;
    email?: string;
    phone?: string;
  }>;
}

export type ContactStatus = 'ACTIVE' | 'INACTIVE';
/** Interface tepat sesuai JSON response dari GET /api/customers/:id/contacts */

export interface CustomerContactSummaryItem {
  customer_contact_id: string | number;
  customer_id: string | number;
  contact_name: string;
  job_title?: string | null;
  phone_number?: string | null;
  email?: string | null;
  is_primary: boolean;
  status: ContactStatus;
  created_at?: string;
}
