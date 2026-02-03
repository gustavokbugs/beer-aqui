import React from 'react';
import { View, ViewProps } from 'react-native';
import { theme } from '@/theme';

type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

export interface SpacingProps extends ViewProps {
  size?: SpacingSize;
  horizontal?: boolean;
  vertical?: boolean;
}

export const Spacing: React.FC<SpacingProps> = ({
  size = 'md',
  horizontal = false,
  vertical = true,
  style,
  ...props
}) => {
  const spacing = theme.spacing[size];

  const spacingStyle = {
    width: horizontal ? spacing : undefined,
    height: vertical ? spacing : undefined,
  };

  return <View style={[spacingStyle, style]} {...props} />;
};
