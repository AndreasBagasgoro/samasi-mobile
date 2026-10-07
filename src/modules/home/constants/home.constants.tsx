import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BlueGradientSet } from '@shared/constants';
import { ActionItemType, QuickActionItem } from '../types/home.types';

/** Target jumlah aktivitas diary per hari (konvensi internal, bukan dari backend). */
export const DAILY_ACTIVITY_TARGET = 5;

export const QUICK_ACTION_ITEMS: QuickActionItem[] = [
  {
    id: 'new-diary',
    label: 'New Diary',
    description: 'Log an activity',
    icon: <Ionicons name="create-outline" size={20} color="#FFF" />,
    gradient: BlueGradientSet[0],
    route: '/home/diary/create',
  },
  {
    id: 'new-customer',
    label: 'New Customer',
    description: 'Add a company',
    icon: <Ionicons name="person-add-outline" size={20} color="#FFF" />,
    gradient: BlueGradientSet[1],
    route: '/home/customers/add-contact',
  },
  {
    id: 'search-contact',
    label: 'Contacts',
    description: 'Find people fast',
    icon: <Ionicons name="search-outline" size={20} color="#FFF" />,
    gradient: BlueGradientSet[3],
    route: '/home/customer-contacts',
  },
  {
    id: 'create-deal',
    label: 'Create Deal',
    description: 'Start a pipeline',
    icon: <Ionicons name="briefcase-outline" size={20} color="#FFF" />,
    gradient: BlueGradientSet[2],
    route: '/home/deals/create',
  },
];

export interface ActionItemPresentation {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  backgroundColor: string;
}

/** Tampilan (warna/ikon/label) per tipe action item, diurutkan dari paling mendesak. */
export const ACTION_ITEM_PRESENTATION: Record<ActionItemType, ActionItemPresentation> = {
  OVERDUE: {
    label: 'Lewat',
    icon: 'alert-circle-outline',
    color: '#E5484D',
    backgroundColor: 'rgba(229, 72, 77, 0.10)',
  },
  DUE_SOON: {
    label: 'Akan close',
    icon: 'time-outline',
    color: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
  },
  STALE: {
    label: 'Tanpa aktivitas',
    icon: 'moon-outline',
    color: '#64748B',
    backgroundColor: 'rgba(100, 116, 139, 0.10)',
  },
};
