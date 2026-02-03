import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Search: undefined;
  Map: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Search Stack
export type SearchStackParamList = {
  SearchHome: undefined;
  ProductDetails: { productId: string };
  VendorDetails: { vendorId: string };
};

// Map Stack
export type MapStackParamList = {
  MapView: undefined;
  VendorDetails: { vendorId: string };
};

// Root Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  Splash: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
