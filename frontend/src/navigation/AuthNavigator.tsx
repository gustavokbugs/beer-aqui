import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';

// Placeholder screens - will be created in Phase 3
import { View } from 'react-native';
import { Text } from '@/components';

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="h2">{title}</Text>
  </View>
);

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login">
        {() => <PlaceholderScreen title="Login Screen" />}
      </Stack.Screen>
      <Stack.Screen name="Register">
        {() => <PlaceholderScreen title="Register Screen" />}
      </Stack.Screen>
      <Stack.Screen name="ForgotPassword">
        {() => <PlaceholderScreen title="Forgot Password Screen" />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
