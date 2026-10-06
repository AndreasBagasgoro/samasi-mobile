import { Linking } from 'react-native';
import { getBlueGradient } from '@shared/constants';
import { ContactItem, CustomerContactSummary } from '../types';

export const getInitials = (name?: string, fallback = 'CT'): string => {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const getAvatarGradient = (name?: string): [string, string] => getBlueGradient(name || '');

export const formatContact = (item: CustomerContactSummary): ContactItem => {
  const name = item.contact_name || 'No Name';
  const jobTitle = item.job_title || '';
  const customerName = item.customer_name || '';

  return {
    id: String(item.customer_contact_id),
    customerId: String(item.customer_id),
    name,
    initials: getInitials(name),
    jobTitle,
    customerName,
    subtitle: [jobTitle, customerName].filter(Boolean).join(' · '),
    phone: item.phone_number || '',
    email: item.email || '',
    isPrimary: item.is_primary ?? false,
    status: item.status || 'ACTIVE',
  };
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-07-29T10:00:00+07:00" -> "Jul 29" (atau "Jul 29, 2026" jika withYear) */
export const formatShortDate = (value?: string | null, withYear = false): string => {
  if (!value) return '-';
  const date = new Date(value);
  if (isNaN(date.getTime())) return '-';
  const base = `${MONTHS[date.getMonth()]} ${date.getDate()}`;
  return withYear ? `${base}, ${date.getFullYear()}` : base;
};

/** Sisakan digit dan "+" saja untuk dipakai di tel:/wa.me */
const cleanPhone = (phone: string): string => phone.replace(/[^\d+]/g, '');

/** Nomor lokal Indonesia (08xx) -> format internasional tanpa "+" (628xx) untuk wa.me */
export const toWhatsAppNumber = (phone: string): string => {
  const cleaned = cleanPhone(phone);
  if (cleaned.startsWith('+')) return cleaned.slice(1);
  if (cleaned.startsWith('00')) return cleaned.slice(2);
  if (cleaned.startsWith('0')) return `62${cleaned.slice(1)}`;
  return cleaned;
};

const openUrl = async (url: string): Promise<boolean> => {
  try {
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
};

export const callPhone = (phone: string) => openUrl(`tel:${cleanPhone(phone)}`);
export const sendSms = (phone: string) => openUrl(`sms:${cleanPhone(phone)}`);
export const openWhatsApp = (phone: string) => openUrl(`https://wa.me/${toWhatsAppNumber(phone)}`);
export const sendEmail = (email: string) => openUrl(`mailto:${email}`);
