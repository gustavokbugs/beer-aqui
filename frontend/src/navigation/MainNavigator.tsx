import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { theme } from '@/theme';
import { SearchScreen, MapScreen, FavoritesScreen, ProfileScreen } from '@/screens';
import { Text } from '@/components';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.gray[400],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.gray[200],
          paddingTop: theme.spacing.xs,
          paddingBottom: theme.spacing.sm,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
        },
      }}
    >
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Buscar',
          tabBarIcon: () => <Text>🔍</Text>,
        }}
      />

      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Mapa',
          tabBarIcon: () => <Text>🗺️</Text>,
        }}
      />

      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Favoritos',
          tabBarIcon: () => <Text>⭐</Text>,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Perfil',
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};
