import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import {
  Container,
  Text,
  Input,
  Card,
  Spacing,
  Loading,
  ErrorMessage,
  Button,
} from '@/components';
import { useProductStore } from '@/store/product.store';
import { useLocationStore } from '@/store/location.store';
import { theme } from '@/theme';
import { formatPrice, formatVolume, formatDistance, getProductVolume } from '@/utils';
import { Product } from '@/types';
import { productService } from '@/services/product.service';

export const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [useLocationFilters, setUseLocationFilters] = useState(false);

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
    if (!useLocationFilters) {
      loadInitialData();
    }
  }, [useLocationFilters]);

  useEffect(() => {
    // Autocomplete: buscar sugest\u00f5es enquanto digita
    const fetchSuggestions = async () => {
      if (searchQuery.length >= 2) {
        try {
          const results = await productService.getSuggestions(searchQuery);
          setSuggestions(results);
          setShowSuggestions(results.length > 0);
        } catch (error) {
          console.error('Erro ao buscar sugest\u00f5es:', error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const loadInitialData = async () => {
    await getCurrentLocation();
    if (currentLocation && !useLocationFilters) {
      await searchProducts({
        ...filters,
        radiusKm: filters.radiusKm || 5,
      });
    }
  };

  const handleSearch = async () => {
    setShowSuggestions(false);

    const searchFilters: any = {
      ...filters,
    };

    if (searchQuery.trim()) {
      searchFilters.brand = searchQuery.trim();
    }

    if (useLocationFilters) {
      if (state.trim()) searchFilters.state = state.trim();
      if (city.trim()) searchFilters.city = city.trim();
      if (neighborhood.trim()) searchFilters.neighborhood = neighborhood.trim();
    }

    await searchProducts(searchFilters);
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setFilters({ brand: suggestion });
    searchProducts({ ...filters, brand: suggestion });
  };

  const toggleLocationMode = () => {
    setUseLocationFilters(!useLocationFilters);
    if (useLocationFilters) {
      // Limpar filtros de localiza\u00e7\u00e3o
      setCity('');
      setState('');
      setNeighborhood('');
      setFilters({ state: undefined, city: undefined, neighborhood: undefined });
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
          <Text variant="body" color="secondary">
            R$ {(parseFloat(item.price) / (volumeMl / 1000)).toFixed(2)}/L
          </Text>
        </View>

        {item.vendor && (
          <>
            <Spacing size="sm" />
            <View style={styles.vendorInfo}>
              <Text variant="body" weight="semibold">
                🏪 {item.vendor.companyName}
              </Text>
              <Text variant="caption" color="secondary">
                📍 {item.vendor.city} - {item.vendor.state}
              </Text>
              {item.vendor.neighborhood && (
                <Text variant="caption" color="light">
                  {item.vendor.neighborhood}
                </Text>
              )}
            </View>
          </>
        )}

        {item.description && (
          <>
            <Spacing size="xs" />
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
            placeholder="Buscar por marca (ex: Heineken)..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            rightIcon={<Text>🔍</Text>}
          />

          {/* Autocomplete Suggestions */}
          {showSuggestions && (
            <View style={styles.suggestionsContainer}>
              <ScrollView style={styles.suggestionsList} keyboardShouldPersistTaps="handled">
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionItem}
                    onPress={() => handleSuggestionPress(suggestion)}
                  >
                    <Text variant="body">🍺 {suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <Spacing size="md" />

        {/* Toggle de Filtro de Localiza\u00e7\u00e3o */}
        <Button
          variant={useLocationFilters ? 'primary' : 'outline'}
          size="sm"
          onPress={toggleLocationMode}
        >
          {useLocationFilters ? '📍 Busca por Localiza\u00e7\u00e3o Ativa' : '🌍 Buscar em Outras Cidades'}
        </Button>

        {/* Filtros de Localiza\u00e7\u00e3o */}
        {useLocationFilters && (
          <>
            <Spacing size="sm" />
            <Input
              placeholder="Estado (ex: RS)"
              value={state}
              onChangeText={setState}
              autoCapitalize="characters"
            />
            <Spacing size="sm" />
            <Input
              placeholder="Cidade (ex: Santa Cruz do Sul)"
              value={city}
              onChangeText={setCity}
            />
            <Spacing size="sm" />
            <Input
              placeholder="Bairro (opcional)"
              value={neighborhood}
              onChangeText={setNeighborhood}
            />
            <Spacing size="sm" />
            <Button onPress={handleSearch} disabled={isLoading}>
              Buscar nesta localização
            </Button>
          </>
        )}
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
    position: 'relative',
  },

  suggestionsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.primary,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[300],
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  suggestionsList: {
    maxHeight: 200,
  },

  suggestionItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
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

  vendorInfo: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray[200],
    paddingTop: theme.spacing.sm,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
