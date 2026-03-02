import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList, SearchStackParamList, VendorStackParamList } from './types';
import { theme } from '@/theme';
import { 
  SearchScreen, 
  ProductDetailsScreen, 
  MapScreen, 
  FavoritesScreen, 
  ProfileScreen,
  ManageProductsScreen,
  AddProductScreen,
  EditProductScreen,
} from '@/screens';
import { Text } from '@/components';
import { useAuthStore } from '@/store/auth.store';

const Tab = createBottomTabNavigator<MainTabParamList>();
const SearchStack = createStackNavigator<SearchStackParamList>();
const VendorStack = createStackNavigator<VendorStackParamList>();

const SearchNavigator = () => {
  return (
    <SearchStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <SearchStack.Screen name="SearchHome" component={SearchScreen} />
      <SearchStack.Screen name="ProductDetails" component={ProductDetailsScreen} />
    </SearchStack.Navigator>
  );
};

const VendorNavigator = () => {
  return (
    <VendorStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <VendorStack.Screen name="ManageProducts" component={ManageProductsScreen} />
      <VendorStack.Screen name="AddProduct" component={AddProductScreen} />
      <VendorStack.Screen name="EditProduct" component={EditProductScreen} />
    </VendorStack.Navigator>
  );
};

export const MainNavigator = () => {
  const { user } = useAuthStore();
  const isVendor = user?.role === 'VENDOR';

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
        component={SearchNavigator}
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

      {isVendor && (
        <Tab.Screen
          name="Vendor"
          component={VendorNavigator}
          options={{
            headerShown: false,
            tabBarLabel: 'Produtos',
            tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
          }}
        />
      )}

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
