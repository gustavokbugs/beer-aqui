export const colors = {
  primary: {
    main: '#FFA500', // Laranja (cor da cerveja)
    light: '#FFB733',
    dark: '#CC8400',
  },
  secondary: {
    main: '#2C3E50', // Azul escuro
    light: '#34495E',
    dark: '#1A252F',
  },
  success: {
    main: '#27AE60',
    light: '#2ECC71',
    dark: '#1E8449',
  },
  error: {
    main: '#E74C3C',
    light: '#EC7063',
    dark: '#C0392B',
  },
  warning: {
    main: '#F39C12',
    light: '#F5B041',
    dark: '#D68910',
  },
  info: {
    main: '#3498DB',
    light: '#5DADE2',
    dark: '#2874A6',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    dark: '#1F2937',
  },
  text: {
    primary: '#1F2937',
    secondary: '#6B7280',
    light: '#9CA3AF',
    inverse: '#FFFFFF',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const theme = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};

export type Theme = typeof theme;
