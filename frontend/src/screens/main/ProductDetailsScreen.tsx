import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Container,
  Text,
  Card,
  Spacing,
  Loading,
  ErrorMessage,
  Button,
} from '@/components';
import { theme } from '@/theme';
import { formatPrice, formatVolume, getProductVolume } from '@/utils';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { useLocationStore } from '@/store/location.store';
import { SearchStackParamList } from '@/navigation/types';

type NavigationProp = StackNavigationProp<SearchStackParamList, 'ProductDetails'>;
type ProductDetailsRouteProp = RouteProp<SearchStackParamList, 'ProductDetails'>;

export const ProductDetailsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ProductDetailsRouteProp>();
  const { productId } = route.params;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { currentLocation } = useLocationStore();

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getById(productId);
      console.log('Product loaded:', JSON.stringify(data, null, 2));
      // A API retorna { product, vendor }
      const productWithVendor = {
        ...data.product,
        vendor: data.vendor,
      };
      setProduct(productWithVendor);
    } catch (err: any) {
      console.error('Error loading product:', err);
      setError(err.message || 'Erro ao carregar produto');
    } finally {
      setIsLoading(false);
    }
  };

  const openMaps = () => {
    if (!product?.vendor) {
      Alert.alert('Aviso', 'Informações do vendedor não disponíveis');
      return;
    }

    const vendor = product.vendor;
    const latitude = vendor.latitude || vendor.location?.latitude;
    const longitude = vendor.longitude || vendor.location?.longitude;

    if (!latitude || !longitude) {
      Alert.alert('Aviso', 'Localização do vendedor não disponível');
      return;
    }

    const label = encodeURIComponent(vendor.companyName);
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });

    let url = '';

    if (Platform.OS === 'ios') {
      // Apple Maps
      url = `${scheme}?q=${label}&ll=${latitude},${longitude}`;
    } else {
      // Google Maps no Android
      url = `${scheme}${latitude},${longitude}?q=${latitude},${longitude}(${label})`;
    }

    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback para Google Maps web
          const webUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
          return Linking.openURL(webUrl);
        }
      })
      .catch((err) => {
        Alert.alert('Erro', 'Não foi possível abrir o mapa');
        console.error('Erro ao abrir mapa:', err);
      });
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  if (isLoading) {
    return <Loading fullScreen message="Carregando detalhes..." />;
  }

  if (error || !product) {
    return (
      <Container safe padding center>
        <ErrorMessage
          message={error || 'Produto não encontrado'}
          onRetry={loadProduct}
          retryLabel="Tentar novamente"
        />
      </Container>
    );
  }

  const volumeMl = getProductVolume(product);
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price || '0');
  const pricePerLiter = price / (volumeMl / 1000);
  const vendor = product.vendor;
  
  let distance: number | null = null;
  if (currentLocation && vendor) {
    const vendorLat = vendor.latitude || vendor.location?.latitude;
    const vendorLng = vendor.longitude || vendor.location?.longitude;
    if (vendorLat && vendorLng) {
      distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        vendorLat,
        vendorLng
      );
    }
  }

  return (
    <Container safe padding={false}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </Button>
        </View>

        <View style={styles.content}>
          {/* Product Info */}
          <Card variant="elevated" padding="lg">
            <View style={styles.productHeader}>
              <Ionicons name="beer" size={48} color={theme.colors.primary.main} />
              <View style={styles.productTitleContainer}>
                <Text variant="h1" weight="bold">
                  {product.brand}
                </Text>
                <Text variant="h2" weight="bold" color="primary">
                  {formatPrice(price)}
                </Text>
              </View>
            </View>

            <Spacing size="md" />

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="resize-outline" size={20} color={theme.colors.secondary.main} />
                <Text variant="body" color="secondary">
                  {formatVolume(volumeMl)}
                </Text>
              </View>

              <View style={styles.detailItem}>
                <Ionicons name="pricetag-outline" size={20} color={theme.colors.secondary.main} />
                <Text variant="body" color="secondary">
                  R$ {pricePerLiter.toFixed(2)}/L
                </Text>
              </View>

              {product.stockQuantity !== undefined && (
                <View style={styles.detailItem}>
                  <Ionicons name="cube-outline" size={20} color={theme.colors.secondary.main} />
                  <Text variant="body" color="secondary">
                    {product.stockQuantity} em estoque
                  </Text>
                </View>
              )}
            </View>

            {product.description && (
              <>
                <Spacing size="md" />
                <View style={styles.divider} />
                <Spacing size="md" />
                <Text variant="body" color="secondary">
                  {product.description}
                </Text>
              </>
            )}
          </Card>

          <Spacing size="lg" />

          {/* Vendor Info */}
          {vendor && (
            <Card variant="elevated" padding="lg">
              <View style={styles.sectionHeader}>
                <Ionicons name="storefront" size={24} color={theme.colors.primary.main} />
                <Text variant="h2" weight="bold">
                  Estabelecimento
                </Text>
              </View>

              <Spacing size="md" />

              <View style={styles.vendorInfo}>
                <Text variant="h3" weight="semibold">
                  {vendor.companyName}
                </Text>

                <Spacing size="sm" />

                <View style={styles.vendorDetail}>
                  <Ionicons name="location" size={18} color={theme.colors.secondary.main} />
                  <Text variant="body" color="secondary" style={styles.vendorDetailText}>
                    {vendor.address?.street || vendor.city}, {vendor.address?.number || ''} - {vendor.city || vendor.address?.city} - {vendor.state || vendor.address?.state}
                  </Text>
                </View>

                {vendor.neighborhood && (
                  <View style={styles.vendorDetail}>
                    <Ionicons name="navigate" size={18} color={theme.colors.secondary.main} />
                    <Text variant="body" color="secondary" style={styles.vendorDetailText}>
                      {vendor.neighborhood}
                    </Text>
                  </View>
                )}

                {vendor.phone && (
                  <View style={styles.vendorDetail}>
                    <Ionicons name="call" size={18} color={theme.colors.secondary.main} />
                    <Text variant="body" color="secondary" style={styles.vendorDetailText}>
                      {vendor.phone}
                    </Text>
                  </View>
                )}

                {distance !== null && (
                  <View style={styles.vendorDetail}>
                    <Ionicons name="location-outline" size={18} color={theme.colors.secondary.main} />
                    <Text variant="body" color="secondary" style={styles.vendorDetailText}>
                      {distance < 1 
                        ? `${(distance * 1000).toFixed(0)}m de distância`
                        : `${distance.toFixed(1)}km de distância`
                      }
                    </Text>
                  </View>
                )}

                <Spacing size="md" />

                <Button
                  variant="primary"
                  onPress={openMaps}
                  style={styles.mapButton}
                >
                  <View style={styles.mapButtonContent}>
                    <Ionicons name="navigate" size={20} color="#FFFFFF" />
                    <Text variant="body" weight="semibold" style={styles.mapButtonText}>
                      Ver rota no mapa
                    </Text>
                  </View>
                </Button>
              </View>
            </Card>
          )}

          <Spacing size="xl" />
        </View>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },

  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
  },

  backButton: {
    alignSelf: 'flex-start',
  },

  content: {
    padding: theme.spacing.md,
  },

  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },

  productTitleContainer: {
    flex: 1,
  },

  detailsGrid: {
    gap: theme.spacing.sm,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.gray[200],
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  vendorInfo: {
    width: '100%',
  },

  vendorDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },

  vendorDetailText: {
    flex: 1,
  },

  mapButton: {
    width: '100%',
  },

  mapButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },

  mapButtonText: {
    color: '#FFFFFF',
  },
});
