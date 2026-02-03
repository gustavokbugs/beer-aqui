import React from 'react';
import { View, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';
import { Button } from './Button';

export interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Ops!',
  message,
  onRetry,
  retryLabel = 'Tentar novamente',
}) => {
  return (
    <View style={styles.container}>
      <Text variant="h3" weight="bold" color="error" center>
        {title}
      </Text>
      <Text variant="body" color="secondary" center style={styles.message}>
        {message}
      </Text>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onPress={onRetry}
          style={styles.button}
        >
          {retryLabel}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },

  message: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },

  button: {
    marginTop: theme.spacing.md,
  },
});
