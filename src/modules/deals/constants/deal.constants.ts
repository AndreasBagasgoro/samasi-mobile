import { Colors } from '@shared/constants';
import { StageColor } from '../types';

export const DEAL_CURRENCY = 'Rp';

/** Jumlah deal yang diambil sekaligus untuk board kanban (batas maksimal API: 1000) */
export const DEAL_BOARD_LIMIT = 500;

// Warna stage aktif dipakai bergiliran berdasarkan urutan (sequence) stage
export const STAGE_COLORS: StageColor[] = [
  { bg: Colors.semanticBg.info, text: Colors.primary, dot: Colors.primary },
  { bg: '#FFEDD5', text: '#EA580C', dot: '#F97316' },
  { bg: '#EDE9FE', text: '#6D28D9', dot: '#8B5CF6' },
  { bg: '#CFFAFE', text: '#0E7490', dot: '#06B6D4' },
  { bg: '#FEF3C7', text: '#B45309', dot: '#F59E0B' },
];

export const WON_STAGE_COLOR: StageColor = {
  bg: Colors.semanticBg.success,
  text: '#15803D',
  dot: Colors.semantic.success,
};

export const LOST_STAGE_COLOR: StageColor = {
  bg: Colors.semanticBg.error,
  text: '#DC2626',
  dot: Colors.semantic.error,
};
