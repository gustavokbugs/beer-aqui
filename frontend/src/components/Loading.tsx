import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '@/theme';
import { Text } from './Text';

export interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = theme.colors.primary.main,
  message,
  fullScreen = false,
}) => {
  if (fullScreen) {
    return (
      <View style={styles.fullScreen}>
        <View style={styles.container}>
          <ActivityIndicator size={size} color={color} />
          {message && (
            <Text variant="body" color="secondary" style={styles.message}>
              {message}
            </Text>
          )}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text variant="body" color="secondary" style={styles.message}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },

  message: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
