import React from 'react';

export interface QuickActionItem {
  id?: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  gradient?: [string, string];
  cardBackgroundColor?: string;
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
