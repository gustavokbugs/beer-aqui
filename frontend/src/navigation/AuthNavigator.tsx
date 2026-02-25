import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthStackParamList } from './types';
import { 
  WelcomeScreen, 
  LoginScreen, 
  RegisterScreen,
  RegisterClientScreen,
  RegisterVendorScreen,
  RegisterVendorStep2Screen 
} from '@/screens';

const Stack = createStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Welcome"
    >
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RegisterClient" 
        component={RegisterClientScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RegisterVendor" 
        component={RegisterVendorScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="RegisterVendorStep2" 
        component={RegisterVendorStep2Screen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
