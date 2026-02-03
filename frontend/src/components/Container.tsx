import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';

export interface ContainerProps extends ViewProps {
  safe?: boolean;
  padding?: boolean;
  center?: boolean;
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  safe = true,
  padding = true,
  center = false,
  style,
  children,
  ...props
}) => {
  const Wrapper = safe ? SafeAreaView : View;

  return (
    <Wrapper
      style={[
        styles.container,
        padding && styles.padding,
        center && styles.center,
        style,
      ]}
      {...props}
    >
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },

  padding: {
    paddingHorizontal: theme.spacing.md,
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
