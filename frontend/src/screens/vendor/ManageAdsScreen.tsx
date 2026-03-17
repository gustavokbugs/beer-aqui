import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { Container, Text, Card, Spacing, Loading, ErrorMessage, Button } from '@/components';
import { VendorStackParamList } from '@/navigation/types';
import { Product, Ad } from '@/types';
import { productService } from '@/services/product.service';
import { adService } from '@/services/ad.service';
import { theme } from '@/theme';
import { formatPrice } from '@/utils';

type NavigationProp = StackNavigationProp<VendorStackParamList, 'ManageAds'>;

type ProductMap = Record<string, Product>;

export const ManageAdsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [products, setProducts] = useState<Product[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
  const [isLoadingMoreAds, setIsLoadingMoreAds] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productsPage, setProductsPage] = useState(1);
  const [productsTotal, setProductsTotal] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [adsPage, setAdsPage] = useState(1);
  const [adsTotal, setAdsTotal] = useState(0);
  const [hasMoreAds, setHasMoreAds] = useState(false);

  const productById = useMemo<ProductMap>(
    () => products.reduce((acc, product) => ({ ...acc, [product.id]: product }), {}),
    [products]
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [myProductsResponse, myAdsResponse] = await Promise.all([
        productService.getMyProducts(true, 1, 20),
        adService.listMine(1, 20),
      ]);

      setProducts(myProductsResponse.products || []);
      setProductsPage(myProductsResponse.page);
      setProductsTotal(myProductsResponse.total);
      setHasMoreProducts(myProductsResponse.page * myProductsResponse.limit < myProductsResponse.total);

      setAds(myAdsResponse.ads || []);
      setAdsPage(myAdsResponse.page);
      setAdsTotal(myAdsResponse.total);
      setHasMoreAds(myAdsResponse.page * myAdsResponse.limit < myAdsResponse.total);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erro ao carregar anúncios');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreProducts = async () => {
    if (isLoading || isLoadingMoreProducts || !hasMoreProducts) {
      return;
    }

    try {
      setIsLoadingMoreProducts(true);
      const response = await productService.getMyProducts(true, productsPage + 1, 20);
      setProducts((current) => [...current, ...response.products]);
      setProductsPage(response.page);
      setProductsTotal(response.total);
      setHasMoreProducts(response.page * response.limit < response.total);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || err?.message || 'Erro ao carregar mais produtos');
    } finally {
      setIsLoadingMoreProducts(false);
    }
  };

  const loadMoreAds = async () => {
    if (isLoading || isLoadingMoreAds || !hasMoreAds) {
      return;
    }

    try {
      setIsLoadingMoreAds(true);
      const response = await adService.listMine(adsPage + 1, 20);
      setAds((current) => [...current, ...response.ads]);
      setAdsPage(response.page);
      setAdsTotal(response.total);
      setHasMoreAds(response.page * response.limit < response.total);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || err?.message || 'Erro ao carregar mais anúncios');
    } finally {
      setIsLoadingMoreAds(false);
    }
  };

  const handleCreateAd = (productId?: string) => {
    navigation.navigate('CreateAd', productId ? { productId } : undefined);
  };

  const handleCancelAd = (ad: Ad) => {
    Alert.alert('Cancelar anúncio', 'Tem certeza que deseja cancelar este anúncio?', [
      { text: 'Não', style: 'cancel' },
      {
        text: 'Sim, cancelar',
        style: 'destructive',
        onPress: async () => {
          try {
            await adService.cancel(ad.id);
            loadData();
          } catch (err: any) {
            Alert.alert('Erro', err?.response?.data?.message || err?.message || 'Erro ao cancelar anúncio');
          }
        },
      },
    ]);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <Card variant="outlined" padding="md" style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <Text variant="h3" weight="semibold">{item.brand}</Text>
          <Text variant="caption" color="secondary">
            {item.volume}ml • {formatPrice(item.price)}
          </Text>
        </View>
        <Button size="sm" onPress={() => handleCreateAd(item.id)}>
          Criar anúncio
        </Button>
      </View>
    </Card>
  );

  const renderAd = ({ item }: { item: Ad }) => {
    const product = productById[item.productId];

    return (
      <Card variant="elevated" padding="md" style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <View style={styles.itemInfo}>
            <Text variant="h3" weight="semibold">{product?.brand || 'Produto'}</Text>
            <Text variant="caption" color="secondary">
              Prioridade {item.priority} • {new Date(item.startDate).toLocaleDateString()} a {new Date(item.endDate).toLocaleDateString()}
            </Text>
          </View>
          <TouchableOpacity onPress={() => handleCancelAd(item)}>
            <Ionicons name="close-circle" size={26} color={theme.colors.error.main} />
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  if (isLoading) {
    return <Loading fullScreen message="Carregando anúncios..." />;
  }

  if (error) {
    return (
      <Container safe padding center>
        <ErrorMessage message={error} onRetry={loadData} retryLabel="Tentar novamente" />
      </Container>
    );
  }

  return (
    <Container safe padding>
      <View style={styles.header}>
        <Text variant="h1" weight="bold">Anúncios</Text>
        <Text variant="body" color="secondary">Gerencie os anúncios dos seus produtos</Text>
      </View>

      <Spacing size="lg" />

      <Button variant="primary" onPress={() => handleCreateAd()}>
        Novo anúncio
      </Button>

      <Spacing size="lg" />

      <Text variant="h3" weight="semibold">Anúncios ativos</Text>
      <Spacing size="sm" />

      {ads.length > 0 && (
        <>
          <Text variant="caption" color="secondary">
            {ads.length} de {adsTotal} anúncio(s)
          </Text>
          <Spacing size="sm" />
        </>
      )}

      {ads.length === 0 ? (
        <Card variant="outlined" padding="md">
          <Text variant="body" color="secondary">Você ainda não possui anúncios ativos.</Text>
        </Card>
      ) : (
        <FlatList
          data={ads}
          renderItem={renderAd}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Spacing size="sm" />}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            isLoadingMoreAds ? (
              <Loading message="Carregando mais anúncios..." />
            ) : hasMoreAds ? (
              <View style={styles.footerContainer}>
                <Button variant="outline" onPress={loadMoreAds}>
                  Carregar mais
                </Button>
              </View>
            ) : ads.length > 0 ? (
              <View style={styles.footerContainer}>
                <Text variant="caption" color="secondary">
                  Todos os anúncios foram carregados
                </Text>
              </View>
            ) : null
          }
        />
      )}

      <Spacing size="lg" />

      <Text variant="h3" weight="semibold">Seus produtos</Text>
      <Spacing size="sm" />

      {products.length > 0 && (
        <>
          <Text variant="caption" color="secondary">
            {products.length} de {productsTotal} produto(s)
          </Text>
          <Spacing size="sm" />
        </>
      )}

      {products.length === 0 ? (
        <Card variant="outlined" padding="md">
          <Text variant="body" color="secondary">Cadastre produtos para criar anúncios.</Text>
        </Card>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Spacing size="sm" />}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            isLoadingMoreProducts ? (
              <Loading message="Carregando mais produtos..." />
            ) : hasMoreProducts ? (
              <View style={styles.footerContainer}>
                <Button variant="outline" onPress={loadMoreProducts}>
                  Carregar mais
                </Button>
              </View>
            ) : products.length > 0 ? (
              <View style={styles.footerContainer}>
                <Text variant="caption" color="secondary">
                  Todos os produtos foram carregados
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.sm,
  },
  listContainer: {
    paddingBottom: theme.spacing.sm,
  },
  footerContainer: {
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  itemCard: {
    marginBottom: 0,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
});
