import React, { useState } from 'react';
import {
  TextInput,
  TextInputProps,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
  type?: 'text' | 'password' | 'email' | 'phone' | 'number';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  helperText,
  type = 'text',
  editable = true,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const keyboardType = {
    text: 'default',
    password: 'default',
    email: 'email-address',
    phone: 'phone-pad',
    number: 'numeric',
  }[type] as TextInputProps['keyboardType'];

  const autoCapitalize = type === 'email' ? 'none' : 'sentences';
  const secureTextEntry = type === 'password' && !isPasswordVisible;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderPasswordIcon = () => {
    if (type !== 'password') return null;

    return (
      <TouchableOpacity
        onPress={togglePasswordVisibility}
        style={styles.iconContainer}
      >
        <Text variant="caption">{isPasswordVisible ? '👁️' : '👁️‍🗨️'}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={style}>
      {label && (
        <Text variant="label" weight="medium" style={styles.label}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            !editable && styles.inputDisabled,
          ]}
          placeholderTextColor={theme.colors.text.light}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {type === 'password' ? renderPasswordIcon() : rightIcon && (
          <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>

      {error && (
        <Text variant="caption" color="error" style={styles.helperText}>
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text variant="caption" color="secondary" style={styles.helperText}>
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: theme.spacing.xs,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    minHeight: 48,
  },

  inputContainerFocused: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.background.primary,
  },

  inputContainerError: {
    borderColor: theme.colors.error.main,
  },

  inputContainerDisabled: {
    backgroundColor: theme.colors.gray[100],
    borderColor: theme.colors.gray[200],
  },

  input: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    paddingVertical: theme.spacing.sm,
  },

  inputDisabled: {
    color: theme.colors.text.light,
  },

  iconContainer: {
    marginHorizontal: theme.spacing.xs,
  },

  helperText: {
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },
});
