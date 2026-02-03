import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  style,
  children,
  ...props
}) => {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    outline: styles.outline,
    ghost: styles.ghost,
    danger: styles.danger,
  };

  const sizeStyles = {
    sm: styles.sm,
    md: styles.md,
    lg: styles.lg,
  };

  const textColors: Record<ButtonVariant, 'inverse' | 'primary' | 'error'> = {
    primary: 'inverse',
    secondary: 'inverse',
    outline: 'primary',
    ghost: 'primary',
    danger: 'inverse',
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={
            variant === 'outline' || variant === 'ghost'
              ? theme.colors.primary.main
              : theme.colors.text.inverse
          }
        />
      );
    }

    const textElement =
      typeof children === 'string' ? (
        <Text
          weight="semibold"
          color={textColors[variant]}
          style={sizeStyles[size].text}
        >
          {children}
        </Text>
      ) : (
        children
      );

    if (icon) {
      return (
        <View style={styles.contentWithIcon}>
          {iconPosition === 'left' && <View style={styles.icon}>{icon}</View>}
          {textElement}
          {iconPosition === 'right' && <View style={styles.icon}>{icon}</View>}
        </View>
      );
    }

    return textElement;
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        variantStyles[variant],
        sizeStyles[size].container,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },

  // Variants
  primary: {
    backgroundColor: theme.colors.primary.main,
  },
  secondary: {
    backgroundColor: theme.colors.secondary.main,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: theme.colors.error.main,
  },

  // Sizes
  sm: {
    container: {
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.md,
      minHeight: 36,
    },
    text: {
      fontSize: theme.typography.fontSize.sm,
    },
  },
  md: {
    container: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.lg,
      minHeight: 44,
    },
    text: {
      fontSize: theme.typography.fontSize.md,
    },
  },
  lg: {
    container: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.xl,
      minHeight: 52,
    },
    text: {
      fontSize: theme.typography.fontSize.lg,
    },
  },

  // States
  disabled: {
    opacity: 0.5,
  },

  fullWidth: {
    width: '100%',
  },

  contentWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon: {
    marginHorizontal: theme.spacing.xs,
  },
});
