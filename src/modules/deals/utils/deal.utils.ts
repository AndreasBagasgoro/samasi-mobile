import {
  DEAL_CURRENCY,
  LOST_STAGE_COLOR,
  STAGE_COLORS,
  WON_STAGE_COLOR,
} from '../constants/deal.constants';
import { MoneyValue, PipelineStageItem, StageColor } from '../types';

export const parseMoney = (val?: MoneyValue): number => {
  if (val === null || val === undefined) return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (typeof val === 'string') {
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  }
  if (typeof val === 'object' && 's' in val && 'd' in val) {
    if (!Array.isArray(val.d) || val.d.length === 0) return 0;
    const digits = val.d
      .map((chunk, idx) => (idx === 0 ? String(chunk) : String(chunk).padStart(7, '0')))
      .join('');
    const exp = val.e || 0;
    const num = parseFloat(digits) / Math.pow(10, digits.length - 1 - exp);
    return (val.s >= 0 ? 1 : -1) * num;
  }
  return 0;
};

const addThousandSeparators = (value: string): string =>
  value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatCurrency = (value: number): string =>
  `${DEAL_CURRENCY}${addThousandSeparators(String(Math.round(value)))}`;

export const formatCompactCurrency = (value: number): string => {
  const abs = Math.abs(value);
  const trim = (num: number) => String(Number(num.toFixed(2)));
  if (abs >= 1_000_000_000) return `${DEAL_CURRENCY}${trim(value / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `${DEAL_CURRENCY}${trim(value / 1_000_000)} JT`;
  if (abs >= 1_000) return `${DEAL_CURRENCY}${trim(value / 1_000)} RB`;
  return `${DEAL_CURRENCY}${Math.round(value)}`;
};

export const formatNumberInput = (digits: string): string =>
  digits ? addThousandSeparators(digits) : '';

export const getStageColor = (
  stage?: Pick<PipelineStageItem, 'is_won_stage' | 'is_lost_stage'> | null,
  index = 0
): StageColor => {
  if (stage?.is_won_stage) return WON_STAGE_COLOR;
  if (stage?.is_lost_stage) return LOST_STAGE_COLOR;
  return STAGE_COLORS[Math.max(index, 0) % STAGE_COLORS.length];
};

export const toDateOnly = (dateString?: string | null): string | null => {
  if (!dateString) return null;
  const match = /^(\d{4}-\d{2}-\d{2})/.exec(dateString);
  return match ? match[1] : null;
};

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDealDate = (dateString?: string | null): string => {
  const dateOnly = toDateOnly(dateString);
  if (!dateOnly) return '-';
  const [year, month, day] = dateOnly.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${day}, ${year}`;
};

const getElapsed = (dateString?: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null;
  const diffMs = Math.max(Date.now() - date.getTime(), 0);
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  return { minutes, hours, days, weeks, months, years };
};

export const formatShortRelativeTime = (dateString?: string | null): string => {
  const elapsed = getElapsed(dateString);
  if (!elapsed) return '';
  if (elapsed.years > 0) return `${elapsed.years}y`;
  if (elapsed.months > 0) return `${elapsed.months}mo`;
  if (elapsed.weeks > 0) return `${elapsed.weeks}w`;
  if (elapsed.days > 0) return `${elapsed.days}d`;
  if (elapsed.hours > 0) return `${elapsed.hours}h`;
  if (elapsed.minutes > 0) return `${elapsed.minutes}m`;
  return 'now';
};

export const formatRelativeTime = (dateString?: string | null): string => {
  const elapsed = getElapsed(dateString);
  if (!elapsed) return '-';
  const plural = (count: number, unit: string) => `${count} ${unit}${count > 1 ? 's' : ''} ago`;
  if (elapsed.years > 0) return plural(elapsed.years, 'year');
  if (elapsed.months > 0) return plural(elapsed.months, 'month');
  if (elapsed.weeks > 0) return plural(elapsed.weeks, 'week');
  if (elapsed.days > 0) return plural(elapsed.days, 'day');
  if (elapsed.hours > 0) return plural(elapsed.hours, 'hour');
  if (elapsed.minutes > 0) return plural(elapsed.minutes, 'minute');
  return 'Just now';
};

export const getCurrentQuarterLabel = (date = new Date()): string =>
  `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`;
