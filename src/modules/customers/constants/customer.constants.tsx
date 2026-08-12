import { FilterItem, CustomerItem } from "../types";

export const FILTER_ITEMS: FilterItem[] = [
  {
    id: 'all',
    label: 'All',
    value: 'all',
    selected: true,
  },
  {
    id: 'nvocc',
    label: 'NVOCC',
    value: 'nvocc',
    selected: false,
  },
  {
    id: 'shipping',
    label: 'Shipping',
    value: 'shipping',
    selected: false,
  },
  {
    id: 'freight',
    label: 'Freight',
    value: 'freight',
    selected: false,
  },
  {
    id: 'logistics',
    label: 'Logistics',
    value: 'logistics',
    selected: false,
  },
];

// Palet warna background tegas / tidak pudar (Vibrant Solid Colors)
export const VIBRANT_AVATAR_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald Green
  '#F59E0B', // Amber / Warm Orange
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#6366F1', // Indigo
  '#EF4444', // Red
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
];

export const getAvatarBackgroundColor = (str: string = '') => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % VIBRANT_AVATAR_COLORS.length;
  return VIBRANT_AVATAR_COLORS[index];
};

export const CUSTOMER_ITEMS: CustomerItem[] = [
  {
    id: 'cust-1',
    profileInitial: 'SA',
    name: 'PT Samudera Antar Benua',
    customerType: 'NVOCC',
    totalContacts: 5,
    lastActive: '2 days ago',
  },
  {
    id: 'cust-2',
    profileInitial: 'OP',
    name: 'PT Ocean Pacific Lines',
    customerType: 'Shipping',
    totalContacts: 3,
    lastActive: '3 days ago',
  },
  {
    id: 'cust-3',
    profileInitial: 'DF',
    name: 'PT Delta Freight Logistics',
    customerType: 'Freight',
    totalContacts: 8,
    lastActive: '1 day ago',
  },
  {
    id: 'cust-4',
    profileInitial: 'GC',
    name: 'PT Global Cargo Express',
    customerType: 'Logistics',
    totalContacts: 4,
    lastActive: '4 days ago',
  },
  {
    id: 'cust-5',
    profileInitial: 'MB',
    name: 'PT Mitra Bahari Utama',
    customerType: 'NVOCC',
    totalContacts: 6,
    lastActive: '5 hours ago',
  },
  {
    id: 'cust-6',
    profileInitial: 'SL',
    name: 'PT Sentosa Logistics',
    customerType: 'Shipping',
    totalContacts: 2,
    lastActive: 'Just now',
  },
];