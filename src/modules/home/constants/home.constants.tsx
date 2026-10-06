import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { BlueGradientSet } from '@shared/constants';
import { QuickActionItem, ReminderItem } from '../types/home.types';

export const QUICK_ACTION_ITEMS: QuickActionItem[] = [
  {
    id: 'new-diary',
    label: 'New Diary',
    description: 'Log an activity',
    icon: <Ionicons name="create-outline" size={20} color="#FFF" />,
    gradient: BlueGradientSet[0],
    onPress: () => {},
  },
  {
    id: 'new-customer',
    label: 'New Customer',
    description: 'Add a company',
    icon: <Ionicons name="person-add-outline" size={20} color="#FFF" />,
    gradient: BlueGradientSet[1],
    onPress: () => {},
  },
  {
    id: 'search-contact',
    label: 'Search Contact',
    description: 'Find people fast',
    icon: <Ionicons name="search-outline" size={20} color="#FFF" />,
    gradient: BlueGradientSet[3],
    onPress: () => {},
  },
  {
    id: 'create-deal',
    label: 'Create Deal',
    description: 'Start a pipeline',
    icon: <Ionicons name="briefcase-outline" size={20} color="#FFF" />,
    gradient: BlueGradientSet[2],
    onPress: () => {},
  },
];

export const REMINDER_ITEMS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Pacific Rim Logistics',
    label: 'Daily Log',
    time: '10:00 AM',
    icon: 'document-text-outline',
    iconColor: '#2563EB',
    iconBackgroundColor: 'rgba(37, 99, 235, 0.10)',
    onPress: () => {},
  },
  {
    id: 'rem-2',
    title: 'Follow up Lead: Acme Corp',
    label: 'Call Meeting',
    time: '02:30 PM',
    icon: 'call-outline',
    iconColor: '#0EA5E9',
    iconBackgroundColor: 'rgba(14, 165, 233, 0.12)',
    onPress: () => {},
  },
  {
    id: 'rem-3',
    title: 'Contract Sign: Delta Inc',
    label: 'Urgent Deal',
    time: '04:45 PM',
    icon: 'flag-outline',
    iconColor: '#E5484D',
    iconBackgroundColor: 'rgba(229, 72, 77, 0.10)',
    onPress: () => {},
  },
];
