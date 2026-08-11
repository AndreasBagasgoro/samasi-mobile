import React from 'react';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { QuickActionItem, ReminderItem } from '../types/home.types';

export const QUICK_ACTION_ITEMS: QuickActionItem[] = [
  {
    id: 'new-diary',
    label: 'New Diary',
    icon: <FontAwesome name="book" size={20} color="#FFF" />,
    backgroundColor: '#3B82F6',
    onPress: () => {},
  },
  {
    id: 'new-customer',
    label: 'New Customer',
    icon: <Feather name="user-plus" size={20} color="#FFF" />,
    backgroundColor: '#10B981',
    onPress: () => {},
  },
  {
    id: 'search-contact',
    label: 'Search contact',
    icon: <Feather name="search" size={20} color="#FFF" />,
    backgroundColor: '#F59E0B',
    onPress: () => {},
  },
  {
    id: 'create-deal',
    label: 'Create Deal',
    icon: <Feather name="plus" size={20} color="#FFF" />,
    backgroundColor: '#8B5CF6',
    onPress: () => {},
  },
];

export const REMINDER_ITEMS: ReminderItem[] = [
  {
    id: 'rem-1',
    title: 'Pacific Rim Logistics',
    label: 'Daily Log',
    time: '10:00 AM',
    iconColor: '#3B82F6',
    iconBackgroundColor: 'rgba(59, 130, 246, 0.12)',
    onPress: () => {},
  },
  {
    id: 'rem-2',
    title: 'Follow up Lead: Acme Corp',
    label: 'Call Meeting',
    time: '02:30 PM',
    iconColor: '#F59E0B',
    iconBackgroundColor: 'rgba(245, 158, 11, 0.12)',
    onPress: () => {},
  },
  {
    id: 'rem-3',
    title: 'Contract Sign: Delta Inc',
    label: 'Urgent Deal',
    time: '04:45 PM',
    iconColor: '#EF4444',
    iconBackgroundColor: 'rgba(239, 68, 68, 0.12)',
    onPress: () => {},
  },
];
