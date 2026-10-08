import { ProfileStats } from '../types';

export interface SettingItem {
  id: string;
  label: string;
  defaultValue: boolean;
}

export interface AccountMenuItem {
  id: string;
  label: string;
}

/** Nilai awal kartu statistik selagi data bulanan dari backend belum dimuat. */
export const EMPTY_STATS: ProfileStats = {
  diaries: 0,
  customers: 0,
  deals: 0,
};

export const SETTING_ITEMS: SettingItem[] = [
  { id: 'biometric-login', label: 'Biometric Login', defaultValue: true },
  { id: 'push-notifications', label: 'Push Notifications', defaultValue: true },
  { id: 'customer-reminders', label: 'Customer Reminders', defaultValue: true },
];

export const ACCOUNT_MENU_ITEMS: AccountMenuItem[] = [
  { id: 'edit-profile', label: 'Edit Profile' },
  { id: 'change-password', label: 'Change Password' },
  { id: 'privacy-policy', label: 'Privacy Policy' },
];
