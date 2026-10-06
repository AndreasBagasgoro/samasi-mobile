
export interface FilterItem {
  id?: string;
  label: string;
  value: string;
  selected: boolean;
  onPress?: () => void;
}

export interface DiaryItem {
  id?: string | number;
  title: string;
  interactionType?: string;
  interactionTypeId?: string | number;
  interactionTypeCode?: string;
  entryAt: string;
  customerName?: string;
  customerId?: string | number;
  contactName?: string;
  customerContactId?: string | number;
  contactJobTitle?: string;
  employeeName?: string;
  employeePosition?: string;
  employeeDivision?: string;
  employeeId?: string | number;
  locationName?: string;
  notes?: string | null;
  latitude?: CoordinateValue;
  longitude?: CoordinateValue;
  photos?: DiaryPhotoItem[];
  createdAt?: string;
  onPress?: () => void;
}

export interface DiaryPhoto {
  id?: string | number;
  url: string;
  caption?: string | null;
  fileName?: string | null;
}

export interface DecimalCoordinate {
  s: number;
  e: number;
  d: number[];
}

export type CoordinateValue = number | string | DecimalCoordinate | null;

export interface DiaryCustomer {
  customer_id: string | number;
  customer_code?: string | null;
  customer_name: string;
  short_name?: string | null;
  customer_type_id?: string | number | null;
  npwp?: string | null;
  email?: string | null;
  address?: string | null;
  billing_address?: string | null;
  city?: string | null;
  city_id?: string | number | null;
  document_category_id?: string | number | null;
  payment_term_days?: number | null;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  approval_status?: string | null;
  is_approved_for_transaction?: boolean;
  submitted_at?: string | null;
  submitted_by_employee_id?: string | number | null;
  approved_at?: string | null;
  approved_by_employee_id?: string | number | null;
  rejected_at?: string | null;
  rejected_by_employee_id?: string | number | null;
  revision_reason?: string | null;
  created_at?: string;
  created_by?: string | number | null;
  updated_at?: string | null;
  updated_by?: string | number | null;
  deleted_at?: string | null;
  deleted_by?: string | number | null;
}

export interface DiaryCustomerContact {
  customer_contact_id: string | number;
  customer_id: string | number;
  contact_name: string;
  job_title?: string | null;
  phone_number?: string | null;
  email?: string | null;
  is_primary?: boolean;
  status: 'ACTIVE' | 'INACTIVE' | string;
  created_at?: string;
  created_by?: string | number | null;
  updated_at?: string | null;
  updated_by?: string | number | null;
  deleted_at?: string | null;
  deleted_by?: string | number | null;
  customer?: DiaryCustomer;
}

export interface DiaryEmployee {
  employee_id: string | number;
  employee_code?: string | null;
  full_name: string;
  email: string;
  phone_number?: string | null;
  username?: string | null;
  password_hash?: string;
  role_id?: string | number | null;
  division_id?: string | number | null;
  division_name?: string | null;
  position_id?: string | number | null;
  position_name?: string | null;
  office_id?: string | number | null;
  office_name?: string | null;
  direct_supervisor_id?: string | number | null;
  join_date?: string | null;
  photo_object_key?: string | null;
  photo_file_name?: string | null;
  photo_content_type?: string | null;
  photo_file_size?: number | null;
  is_active?: boolean;
  status?: 'ACTIVE' | 'INACTIVE' | string;
  last_login_at?: string | null;
  created_at?: string;
  created_by?: string | number | null;
  updated_at?: string | null;
  updated_by?: string | number | null;
  deleted_at?: string | null;
  deleted_by?: string | number | null;
}

export interface DiaryInteractionType {
  interaction_type_id: string | number;
  interaction_type_code: string;
  interaction_type_name: string;
  description?: string | null;
  status: 'ACTIVE' | 'INACTIVE' | string;
  created_at?: string;
  created_by?: string | number | null;
  updated_at?: string | null;
  updated_by?: string | number | null;
  deleted_at?: string | null;
  deleted_by?: string | number | null;
}

export interface DiaryInteractionTypeNameItem {
  interaction_type_id: string | number;
  interaction_type_name: string;
}

export interface DiaryInteractionTypeNameResponse {
  data: DiaryInteractionTypeNameItem[];
  meta: DiaryPaginationMeta;
}

export interface DiaryPhotoItem {
  photo_id?: string | number;
  url?: string;
  photo_url?: string;
  photo_object_key?: string | null;
  photo_file_name?: string | null;
  caption?: string | null;
  captured_at?: string | null;
  location_name?: string | null;
  geocoded_at?: string | null;
  accuracy?: number | string | null;
  is_mocked?: boolean;
  [key: string]: any;
}

export interface DiaryEntryItem {
  sales_diary_entry_id: string | number;
  customer_contact_id: string | number;
  employee_id: string | number;
  title: string;
  interaction_type_id: string | number;
  interaction_type?: string;
  interaction_type_name?: string;
  interaction_type_code?: string;
  notes?: string | null;
  latitude?: CoordinateValue;
  longitude?: CoordinateValue;
  entry_at: string;
  created_at: string;
  created_by?: string | null;
  created_by_id?: string | number | null;
  updated_at?: string | null;
  updated_by?: string | null;
  updated_by_id?: string | number | null;
  deleted_at?: string | null;
  deleted_by?: string | null;
  deleted_by_id?: string | number | null;

  customer_contact?: DiaryCustomerContact;
  employee?: DiaryEmployee;
  interaction_type_detail?: DiaryInteractionType;
  photos?: DiaryPhotoItem[];
}

export interface DiaryPaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface DiaryListParams {
  search?: string;
  page?: number;
  per_page?: number;
  interaction_type_id?: string | number;
  customer_id?: string | number;
  customer_contact_id?: string | number;
  employee_id?: string | number;
  start_date?: string;
  end_date?: string;
}

export interface DiaryEntryListResponse {
  success?: boolean;
  code?: string;
  message?: string;
  data: DiaryEntryItem[];
  errors?: any;
  meta: DiaryPaginationMeta;
  request_id?: string;
}

export interface CreateDiaryPayload {
  customer_contact_id: string | number;
  interaction_type_id: string | number;
  title: string;
  entry_at: string;
  notes?: string;
  latitude?: CoordinateValue;
  longitude?: CoordinateValue;
  photos?: any[];
}

export interface UpdateDiaryPayload extends Partial<CreateDiaryPayload> {
  deleted_photo_ids?: (string | number)[];
}

export interface DeleteDiaryResponse {
  success: boolean;
  message: string;
}