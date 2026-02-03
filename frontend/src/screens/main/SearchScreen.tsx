import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Container,
  Text,
  Input,
  Card,
  Spacing,
  Loading,
  ErrorMessage,
} from '@/components';
import { useProductStore } from '@/store/product.store';
import { useLocationStore } from '@/store/location.store';
import { theme } from '@/theme';
import { formatPrice, formatVolume, formatDistance, getProductVolume } from '@/utils';
import { Product } from '@/types';

export const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {
    products,
    isLoading,
    error,
    searchProducts,
    filters,
    setFilters,
    clearError,
  } = useProductStore();
  const { currentLocation, getCurrentLocation } = useLocationStore();

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await getCurrentLocation();
    if (currentLocation) {
      await searchProducts({
        ...filters,
        radiusKm: filters.radiusKm || 5,
      });
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setFilters({ brand: searchQuery.trim() });
      await searchProducts({
        ...filters,
        brand: searchQuery.trim(),
      });
    }
  };

  const handleRefresh = async () => {
    await loadInitialData();
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const volumeMl = getProductVolume(item);
    
    return (
      <Card variant="elevated" padding="md" style={styles.productCard}>
        <View style={styles.productHeader}>
          <Text variant="h3" weight="bold">
            {item.brand}
          </Text>
          <Text variant="h3" weight="bold" color="primary">
            {formatPrice(item.price)}
          </Text>
        </View>

        <Spacing size="sm" />

        <View style={styles.productInfo}>
          <Text variant="body" color="secondary">
            {formatVolume(volumeMl)}
          </Text>
          {item.vendor?.distance && (
            <Text variant="body" color="secondary">
              {formatDistance(item.vendor.distance)}
            </Text>
          )}
        </View>

        {item.vendor && (
          <>
            <Spacing size="sm" />
            <Text variant="caption" color="secondary">
              📍 {item.vendor.companyName}
            </Text>
          </>
        )}

        {item.description && (
          <>
            <Spacing size="sm" />
            <Text variant="caption" color="light">
              {item.description}
            </Text>
          </>
        )}
      </Card>
    );
  };

  const renderEmptyState = () => {
    if (isLoading) return null;

    if (!currentLocation) {
      return (
        <View style={styles.emptyState}>
          <Text variant="h3" center color="secondary">
            📍
          </Text>
          <Spacing size="md" />
          <Text variant="body" center color="secondary">
            Precisamos da sua localização para encontrar cervejas próximas
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text variant="h3" center color="secondary">
          🔍
        </Text>
        <Spacing size="md" />
        <Text variant="body" center color="secondary">
          Nenhum produto encontrado
        </Text>
        <Spacing size="sm" />
        <Text variant="caption" center color="light">
          Tente buscar por outra marca ou aumentar o raio de busca
        </Text>
      </View>
    );
  };

  if (error && !products.length) {
    return (
      <Container safe padding center>
        <ErrorMessage
          message={error}
          onRetry={handleRefresh}
          retryLabel="Tentar novamente"
        />
      </Container>
    );
  }

  return (
    <Container safe padding={false}>
      <View style={styles.header}>
        <Text variant="h2" weight="bold">
          Buscar Cervejas 🍺
        </Text>
        <Spacing size="md" />

        <View style={styles.searchContainer}>
          <Input
            placeholder="Buscar por marca..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            rightIcon={<Text>🔍</Text>}
          />
        </View>
      </View>

      {isLoading && !products.length ? (
        <Loading fullScreen message="Buscando produtos..." />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyState}
          ItemSeparatorComponent={() => <Spacing size="md" />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary.main}
            />
          }
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
  },

  searchContainer: {
    width: '100%',
  },

  listContent: {
    padding: theme.spacing.md,
    flexGrow: 1,
  },

  productCard: {
    width: '100%',
  },

  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
