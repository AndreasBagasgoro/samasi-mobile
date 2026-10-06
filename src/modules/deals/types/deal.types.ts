export type DealStatus = 'OPEN' | 'WON' | 'LOST';

export interface DecimalValue {
  s: number;
  e: number;
  d: number[];
}

export type MoneyValue = number | string | DecimalValue | null;

export interface DealPaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface PipelineStageItem {
  sales_pipeline_stage_id: string;
  pipeline_stage_code: string;
  name: string;
  sequence: number;
  is_won_stage: boolean;
  is_lost_stage: boolean;
  is_final_kanban_stage?: boolean;
  can_close_deal?: boolean;
}

export interface PipelineStageListResponse {
  data: PipelineStageItem[];
  meta: DealPaginationMeta;
}

export interface DealCustomer {
  customerId?: string | number;
  customerName?: string;
  shortName?: string | null;
}

export interface DealCustomerContact {
  customerContactId?: string | number;
  customerId?: string | number;
  contactName?: string;
  jobTitle?: string | null;
  customer?: DealCustomer;
}

export interface SalesDealEntryItem {
  sales_deal_id: string;
  customer_contact_id: string | number;
  sales_pipeline_stage_id: string;
  pipeline_stage_code?: string | null;
  pipeline_stage_name?: string | null;
  is_final_kanban_stage?: boolean;
  can_close_deal?: boolean;
  title: string;
  estimated_value?: MoneyValue;
  expected_close_date?: string | null;
  notes?: string | null;
  owner_id: string | number;
  owner_name?: string | null;
  status: DealStatus;
  last_activity_at?: string | null;
  closed_at?: string | null;
  createdAt?: string;
  customerContact?: DealCustomerContact;
}

export interface DealListParams {
  search?: string;
  page?: number;
  per_page?: number;
  status?: DealStatus;
  customer_contact_id?: string | number;
  owner_id?: string | number;
}

export interface DealListResponse {
  data: SalesDealEntryItem[];
  meta: DealPaginationMeta;
}

export interface DealSummary {
  total_deals: number;
  total_open: number;
  total_won: number;
  total_lost: number;
  total_estimated_value_open: number;
  total_estimated_value_won: number;
  total_estimated_value_lost: number;
}

export interface CreateDealPayload {
  customer_contact_id: string | number;
  title: string;
  sales_pipeline_stage_id?: string;
  estimated_value?: number;
  expected_close_date?: string | null;
  notes?: string | null;
}

export type UpdateDealPayload = Partial<CreateDealPayload>;

/** Bentuk deal yang sudah dirapikan untuk kebutuhan UI */
export interface DealItem {
  id: string;
  title: string;
  value: number;
  status: DealStatus;
  stageId: string;
  stageName: string;
  stageCode?: string;
  customerId?: string;
  customerName: string;
  customerContactId: string;
  contactName?: string;
  ownerName?: string;
  expectedCloseDate?: string | null;
  notes?: string | null;
  lastActivityAt?: string | null;
  createdAt?: string;
}

export interface StageColor {
  bg: string;
  text: string;
  dot: string;
}

export interface PipelineColumn {
  stage: PipelineStageItem;
  color: StageColor;
  deals: DealItem[];
  totalValue: number;
}
