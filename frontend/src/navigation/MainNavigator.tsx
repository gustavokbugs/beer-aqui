import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { theme } from '@/theme';

// Placeholder screens - will be created later
import { View } from 'react-native';
import { Text } from '@/components';

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="h2">{title}</Text>
  </View>
);

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
        options={{
          tabBarLabel: 'Buscar',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🔍</Text>,
        }}
      >
        {() => <PlaceholderScreen title="Search Screen" />}
      </Tab.Screen>

      <Tab.Screen
        name="Map"
        options={{
          tabBarLabel: 'Mapa',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>🗺️</Text>,
        }}
      >
        {() => <PlaceholderScreen title="Map Screen" />}
      </Tab.Screen>

      <Tab.Screen
        name="Favorites"
        options={{
          tabBarLabel: 'Favoritos',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>⭐</Text>,
        }}
      >
        {() => <PlaceholderScreen title="Favorites Screen" />}
      </Tab.Screen>

      <Tab.Screen
        name="Profile"
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24 }}>👤</Text>,
        }}
      >
        {() => <PlaceholderScreen title="Profile Screen" />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};
