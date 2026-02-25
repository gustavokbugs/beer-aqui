import { NavigatorScreenParams } from '@react-navigation/native';

// Auth Stack
export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  RegisterClient: undefined;
  RegisterVendor: undefined;
  RegisterVendorStep2: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigator
export type MainTabParamList = {
  Search: NavigatorScreenParams<SearchStackParamList>;
  Map: undefined;
  Vendor?: NavigatorScreenParams<VendorStackParamList>;
  Favorites: undefined;
  Profile: undefined;
};

// Search Stack
export type SearchStackParamList = {
  SearchHome: undefined;
  ProductDetails: { productId: string };
  VendorDetails: { vendorId: string };
};

// Vendor Stack
export type VendorStackParamList = {
  ManageProducts: undefined;
  AddProduct: undefined;
  EditProduct: { productId: string };
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
