export const Colors = {
  primary: '#0A1628', // Base Primary Color
  secondary: '#FF9F1C', // Accent Orange
  accent: '#2EC4B6',
  
  background: '#F8FAFC',
  surface: '#FFFFFF',
  background2: '#F1F5F9',
  
  text: {
    primary: '#0A1628',
    secondary: '#6C757D',
    disabled: '#ADB5BD',
    inverse: '#FFFFFF',
    label: '#475569',
  },
  
  semantic: {
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#3B82F6',
  },
  
  border: '#E2E8F0',
  transparent: 'transparent',
};

// Konfigurasi Linear Gradient (-27 deg, 0% #0A1628 -> 100% #0D2244)
export const Gradients = {
  primary: {
    colors: ['#0A1628', '#0D2244'] as [string, string],
    locations: [0, 1] as [number, number],
    start: { x: 0.15, y: 0.85 },
    end: { x: 0.85, y: 0.15 },
  },
};
