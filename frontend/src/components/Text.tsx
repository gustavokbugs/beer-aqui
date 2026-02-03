import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { theme } from '@/theme';

type TextVariant = 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type TextColor = 'primary' | 'secondary' | 'light' | 'inverse' | 'error' | 'success';

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  weight?: TextWeight;
  color?: TextColor;
  center?: boolean;
  children: React.ReactNode;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body',
  weight = 'regular',
  color = 'primary',
  center = false,
  style,
  children,
  ...props
}) => {
  const variantStyles = {
    h1: styles.h1,
    h2: styles.h2,
    h3: styles.h3,
    body: styles.body,
    caption: styles.caption,
    label: styles.label,
  };

  const weightStyles = {
    regular: styles.weightRegular,
    medium: styles.weightMedium,
    semibold: styles.weightSemibold,
    bold: styles.weightBold,
  };

  const colorStyles = {
    primary: styles.colorPrimary,
    secondary: styles.colorSecondary,
    light: styles.colorLight,
    inverse: styles.colorInverse,
    error: styles.colorError,
    success: styles.colorSuccess,
  };

  return (
    <RNText
      style={[
        variantStyles[variant],
        weightStyles[weight],
        colorStyles[color],
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  // Variants
  h1: {
    fontSize: theme.typography.fontSize.xxxl,
    lineHeight: theme.typography.fontSize.xxxl * theme.typography.lineHeight.tight,
  },
  h2: {
    fontSize: theme.typography.fontSize.xxl,
    lineHeight: theme.typography.fontSize.xxl * theme.typography.lineHeight.tight,
  },
  h3: {
    fontSize: theme.typography.fontSize.xl,
    lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
  },
  body: {
    fontSize: theme.typography.fontSize.md,
    lineHeight: theme.typography.fontSize.md * theme.typography.lineHeight.normal,
  },
  caption: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.normal,
  },
  label: {
    fontSize: theme.typography.fontSize.xs,
    lineHeight: theme.typography.fontSize.xs * theme.typography.lineHeight.normal,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Weights
  weightRegular: {
    fontWeight: theme.typography.fontWeight.regular,
  },
  weightMedium: {
    fontWeight: theme.typography.fontWeight.medium,
  },
  weightSemibold: {
    fontWeight: theme.typography.fontWeight.semibold,
  },
  weightBold: {
    fontWeight: theme.typography.fontWeight.bold,
  },

  // Colors
  colorPrimary: {
    color: theme.colors.text.primary,
  },
  colorSecondary: {
    color: theme.colors.text.secondary,
  },
  colorLight: {
    color: theme.colors.text.light,
  },
  colorInverse: {
    color: theme.colors.text.inverse,
  },
  colorError: {
    color: theme.colors.error.main,
  },
  colorSuccess: {
    color: theme.colors.success.main,
  },

  // Alignment
  center: {
    textAlign: 'center',
  },
});
