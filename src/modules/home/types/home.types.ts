import React from 'react';

export interface QuickActionItem {
  id?: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  gradient?: [string, string];
  cardBackgroundColor?: string;
  /** Rute expo-router yang dibuka saat kartu ini ditekan. */
  route?: string;
  onPress?: () => void;
}

export interface ReminderItem {
  id?: string;
  title: string;
  label?: string;
  time?: string;
  /** Nama ikon Ionicons */
  icon?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  cardBackgroundColor?: string;
  onPress?: () => void;
}

/** Tipe prioritas deal yang butuh tindakan, dari backend `GET /home/summary`. */
export type ActionItemType = 'OVERDUE' | 'DUE_SOON' | 'STALE';

export interface ActionItemDto {
  type: ActionItemType;
  days: number;
  deal_id: string;
  title: string;
  customer_name: string | null;
  contact_name: string | null;
  expected_close_date: string | null;
  value: number;
}

export interface PipelineStageStatDto {
  stage_id: string;
  code: string;
  name: string;
  sequence: number;
  count: number;
  value: number;
}

export interface RecentDiaryDto {
  id: string;
  title: string | null;
  customer_name: string | null;
  contact_name: string | null;
  interaction_type_name: string | null;
  entry_at: string;
}

export interface HomeSummaryDto {
  deals: {
    open: number;
    won: number;
    lost: number;
    open_value: number;
    won_value: number;
    lost_value: number;
    won_this_month: number;
    won_value_this_month: number;
  };
  pipeline_by_stage: PipelineStageStatDto[];
  action_items: ActionItemDto[];
  activity: {
    today: number;
    this_week: number;
  };
  recent_diaries: RecentDiaryDto[];
}

/** View model untuk UI (dirapikan dari HomeSummaryDto). */
export interface ActionItem {
  id: string;
  type: ActionItemType;
  days: number;
  title: string;
  customerName: string;
  contactName?: string;
  expectedCloseDate: string | null;
  value: number;
}

export interface StageStat {
  id: string;
  name: string;
  sequence: number;
  count: number;
  value: number;
}

export interface RecentDiary {
  id: string;
  title: string;
  customerName: string;
  interactionTypeName?: string;
  entryAt: string;
}

export interface HomeSummary {
  openDeals: number;
  openValue: number;
  wonThisMonth: number;
  wonValueThisMonth: number;
  activityToday: number;
  activityThisWeek: number;
  actionItems: ActionItem[];
  pipelineByStage: StageStat[];
  recentDiaries: RecentDiary[];
}
