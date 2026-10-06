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

/** Statistik placeholder sampai endpoint stats bulanan tersedia di backend. */
export const PLACEHOLDER_STATS: ProfileStats = {
  diaries: 42,
  customers: 28,
  deals: 7,
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
