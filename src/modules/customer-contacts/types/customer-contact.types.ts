export type CustomerContactStatus = 'ACTIVE' | 'INACTIVE';

/** Item ringkas dari GET /customer-contacts/summary */
export interface CustomerContactSummary {
  customer_contact_id: string | number;
  customer_id: string | number;
  customer_name?: string | null;
  contact_name: string;
  job_title?: string | null;
  phone_number?: string | null;
  email?: string | null;
  is_primary: boolean;
  status: CustomerContactStatus;
  created_at?: string;
}

/** Detail dari GET /customer-contacts/:id */
export interface CustomerContactDetail extends CustomerContactSummary {
  updated_at?: string | null;
  created_by?: string | null;
  updated_by?: string | null;
}

/** Bentuk yang dipakai UI (sudah diformat) */
export interface ContactItem {
  id: string;
  customerId: string;
  name: string;
  initials: string;
  jobTitle: string;
  customerName: string;
  /** "Sales Director · Orient Star" */
  subtitle: string;
  phone: string;
  email: string;
  isPrimary: boolean;
  status: CustomerContactStatus;
}

export interface ContactInteraction {
  id: string;
  title: string;
  type: string;
  entryAt: string;
}

export interface CustomerContactListParams {
  search?: string;
  page?: number;
  per_page?: number;
  customer_id?: string | number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface CustomerContactListResponse {
  data: CustomerContactSummary[];
  meta: PaginationMeta;
}

export interface CreateCustomerContactPayload {
  customer_id: string | number;
  contact_name: string;
  job_title?: string;
  phone_number?: string;
  email?: string;
  is_primary?: boolean;
}

export type UpdateCustomerContactPayload = Partial<CreateCustomerContactPayload>;
