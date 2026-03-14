import { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  RegisterClient: undefined;
  RegisterVendor: undefined;
  RegisterVendorStep2: {
    name: string;
    email: string;
    password: string;
  };
  ForgotPassword: undefined;
};

export type MainTabParamList = {
  Search: NavigatorScreenParams<SearchStackParamList>;
  Map: undefined;
  Vendor?: NavigatorScreenParams<VendorStackParamList>;
  Favorites: undefined;
  Profile: undefined;
};

export type SearchStackParamList = {
  SearchHome: undefined;
  ProductDetails: { productId: string };
  VendorDetails: { vendorId: string };
};

export type VendorStackParamList = {
  ManageProducts: undefined;
  ManageAds: undefined;
  CreateAd: { productId?: string } | undefined;
  AddProduct: undefined;
  EditProduct: { productId: string };
};

export type MapStackParamList = {
  MapView: undefined;
  VendorDetails: { vendorId: string };
};

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
