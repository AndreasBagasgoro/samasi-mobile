// Palet dasar: kombinasi biru (navy → royal → sky) untuk tampilan modern & profesional
export const Palette = {
  navy900: '#071A3D',
  navy800: '#0B2A63',
  blue700: '#1D4ED8',
  blue600: '#2563EB',
  blue500: '#3B82F6',
  blue400: '#60A5FA',
  sky400: '#38BDF8',
  cyan500: '#06B6D4',
  indigo500: '#6366F1',
  blue50: '#EFF5FF',
  blue100: '#DCE8FF',
};

export const Colors = {
  primary: Palette.blue700, // Base Primary Color (Royal Blue)
  primaryDark: Palette.navy800,
  primaryLight: Palette.blue500,
  secondary: Palette.sky400, // Accent Sky
  accent: Palette.cyan500,

  background: '#F3F6FC',
  surface: '#FFFFFF',
  background2: '#EAF0FA',
  primarySoft: Palette.blue50,

  text: {
    primary: '#0B1B3F',
    secondary: '#5B6B8C',
    disabled: '#A3B1CC',
    inverse: '#FFFFFF',
    label: '#3D4F75',
    inverseMuted: 'rgba(255, 255, 255, 0.72)',
  },

  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#E5484D',
    info: Palette.blue600,
  },

  semanticBg: {
    success: '#DCFCE7',
    warning: '#FEF3C7',
    error: '#FEE2E2',
    info: Palette.blue100,
  },

  glass: {
    background: 'rgba(255, 255, 255, 0.12)',
    border: 'rgba(255, 255, 255, 0.22)',
    strong: 'rgba(255, 255, 255, 0.2)',
  },

  border: '#E2E9F5',
  transparent: 'transparent',
};

type GradientConfig = {
  colors: readonly [string, string, ...string[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

// Konfigurasi Linear Gradient untuk komponen expo-linear-gradient
export const Gradients = {
  // Header utama: navy gelap → royal blue
  primary: {
    colors: [Palette.navy900, Palette.navy800, Palette.blue700],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Tombol & elemen aksi
  button: {
    colors: [Palette.blue500, Palette.blue700],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Aksen cerah (sky → blue)
  accent: {
    colors: [Palette.sky400, Palette.blue600],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  // Latar lembut untuk ikon & kartu
  soft: {
    colors: [Palette.blue50, Palette.blue100],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
} satisfies Record<string, GradientConfig>;

// Variasi gradient biru untuk avatar & ikon (deterministik berdasarkan nama)
export const BlueGradientSet: [string, string][] = [
  ['#3B82F6', '#1D4ED8'], // Royal
  ['#38BDF8', '#2563EB'], // Sky
  ['#6366F1', '#1E40AF'], // Indigo
  ['#06B6D4', '#1D4ED8'], // Cyan
  ['#60A5FA', '#3730A3'], // Periwinkle
  ['#0EA5E9', '#0B2A63'], // Ocean
];

export const getBlueGradient = (seed: string = ''): [string, string] => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BlueGradientSet[Math.abs(hash) % BlueGradientSet.length];
};

// Bayangan lembut bernuansa biru
export const Shadows = {
  sm: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: '#1D4ED8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 8,
  },
};
