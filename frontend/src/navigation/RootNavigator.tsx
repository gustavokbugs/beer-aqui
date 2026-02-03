import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import { useAuthStore } from '@/store/auth.store';
import { Loading } from '@/components';

const Stack = createStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();

  // Garantir que os valores são boolean
  const isAuth = Boolean(isAuthenticated);
  const loading = Boolean(isLoading);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  if (loading) {
    return <Loading fullScreen message="Carregando..." />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuth ? (
          <Stack.Screen 
            name="Main" 
            component={MainNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
