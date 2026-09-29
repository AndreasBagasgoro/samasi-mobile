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

const AVATAR_PALETTE = [
  '#0052CC', // Blue
  '#0D9488', // Teal
  '#4F46E5', // Indigo
  '#2563EB', // Royal Blue
  '#0284C7', // Sky
  '#059669', // Emerald
  '#7C3AED', // Violet
];

export const getAvatarColor = (name?: string): string => {
  if (!name) return '#0052CC';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
};

export const getInteractionBadgeStyle = (type?: string) => {
  const normalized = (type || '').toLowerCase();

  if (normalized.includes('visit') || normalized.includes('kunjungan')) {
    return {
      bg: '#EBF5FF',
      text: '#2563EB',
    };
  }
  if (normalized.includes('call') || normalized.includes('telepon')) {
    return {
      bg: '#ECFDF5',
      text: '#059669',
    };
  }
  if (normalized.includes('email') || normalized.includes('surat')) {
    return {
      bg: '#F5F3FF',
      text: '#7C3AED',
    };
  }
  if (normalized.includes('meeting') || normalized.includes('rapat')) {
    return {
      bg: '#FFF7ED',
      text: '#EA580C',
    };
  }

  return {
    bg: '#F1F5F9',
    text: '#475569',
  };
};
