import React from 'react';

export interface QuickActionItem {
  id?: string;
  label: string;
  icon: React.ReactNode;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  onPress?: () => void;
}

export interface ReminderItem {
  id?: string;
  title: string;
  label?: string;
  time?: string;
  iconColor?: string;
  iconBackgroundColor?: string;
  cardBackgroundColor?: string;
  onPress?: () => void;
}
