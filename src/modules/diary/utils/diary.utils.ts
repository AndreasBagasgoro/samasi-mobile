import { getBlueGradient } from '@shared/constants';
import { CoordinateValue } from '../types';

export const formatDiaryDateTime = (dateString?: string): string => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month} ${day}, ${year} · ${hours}:${minutes} ${ampm}`;
  } catch {
    return dateString;
  }
};

export const parseCoordinateNumber = (val?: CoordinateValue): number | null => {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return isNaN(val) ? null : val;
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? null : num;
  }
  if (typeof val === 'object' && 's' in val && 'd' in val) {
    const decimalObj = val as { s: number; e: number; d: number[] };
    const sign = decimalObj.s >= 0 ? 1 : -1;
    if (Array.isArray(decimalObj.d) && decimalObj.d.length > 0) {
      const fullNumStr = decimalObj.d.join('');
      const exp = decimalObj.e || 0;
      const num = parseFloat(fullNumStr) / Math.pow(10, fullNumStr.length - 1 - exp);
      return sign * num;
    }
  }
  return null;
};

export const formatCoordinates = (
  latVal?: CoordinateValue,
  lngVal?: CoordinateValue
): string => {
  const lat = parseCoordinateNumber(latVal);
  const lng = parseCoordinateNumber(lngVal);

  if (lat === null || lng === null) {
    return '1.2847° N, 103.8511° E';
  }

  const latDirection = lat >= 0 ? 'N' : 'S';
  const lngDirection = lng >= 0 ? 'E' : 'W';

  return `${Math.abs(lat).toFixed(4)}° ${latDirection}, ${Math.abs(lng).toFixed(4)}° ${lngDirection}`;
};


export const getInitials = (name?: string, fallback = 'DE'): string => {
  if (!name || !name.trim()) return fallback;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const getAvatarColor = (name?: string): string => getBlueGradient(name || '')[1];

export const getAvatarGradient = (name?: string): [string, string] => getBlueGradient(name || '');

type InteractionIcon = 'location-outline' | 'call-outline' | 'mail-outline' | 'people-outline' | 'chatbubble-ellipses-outline';

export interface InteractionBadgeStyle {
  bg: string;
  text: string;
  icon: InteractionIcon;
  gradient: [string, string];
}

export const getInteractionBadgeStyle = (type?: string): InteractionBadgeStyle => {
  const normalized = (type || '').toLowerCase();

  if (normalized.includes('visit') || normalized.includes('kunjungan')) {
    return {
      bg: '#E0EBFF',
      text: '#1D4ED8',
      icon: 'location-outline',
      gradient: ['#3B82F6', '#1D4ED8'],
    };
  }
  if (normalized.includes('call') || normalized.includes('telepon')) {
    return {
      bg: '#E0F2FE',
      text: '#0369A1',
      icon: 'call-outline',
      gradient: ['#38BDF8', '#0284C7'],
    };
  }
  if (normalized.includes('email') || normalized.includes('surat')) {
    return {
      bg: '#E0E7FF',
      text: '#4338CA',
      icon: 'mail-outline',
      gradient: ['#818CF8', '#4338CA'],
    };
  }
  if (normalized.includes('meeting') || normalized.includes('rapat')) {
    return {
      bg: '#CFFAFE',
      text: '#0E7490',
      icon: 'people-outline',
      gradient: ['#22D3EE', '#0E7490'],
    };
  }

  return {
    bg: '#EAF0FA',
    text: '#3D4F75',
    icon: 'chatbubble-ellipses-outline',
    gradient: ['#93C5FD', '#3B82F6'],
  };
};
