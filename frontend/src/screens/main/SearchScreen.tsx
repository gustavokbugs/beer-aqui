import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
              <View style={styles.vendorRow}>
                <Ionicons name="storefront-outline" size={14} color={theme.colors.secondary.main} />
                <Text variant="body" weight="semibold" style={styles.vendorText}>
                  {item.vendor.companyName}
                </Text>
              </View>
              <View style={styles.vendorRow}>
                <Ionicons name="location-outline" size={14} color={theme.colors.secondary.main} />
                <Text variant="caption" color="secondary" style={styles.vendorText}>
                  {item.vendor.city} - {item.vendor.state}
                </Text>
              </View>
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
          <Ionicons name="location-outline" size={60} color={theme.colors.secondary.main} />
          <Spacing size="md" />
          <Text variant="body" center color="secondary">
            Precisamos da sua localização para encontrar cervejas próximas
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="search-outline" size={60} color={theme.colors.secondary.main} />
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
        <View style={styles.titleContainer}>
          <Ionicons name="beer" size={28} color={theme.colors.primary.main} />
          <Text variant="h2" weight="bold" style={styles.titleText}>
            Buscar Cervejas
          </Text>
        </View>
        <Spacing size="md" />

        <View style={styles.searchContainer}>
          <Input
            placeholder="Buscar por marca (ex: Heineken)..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            rightIcon={<Ionicons name="search" size={20} color={theme.colors.secondary.main} />}
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
                    <View style={styles.suggestionContent}>
                      <Ionicons name="beer-outline" size={18} color={theme.colors.secondary.main} />
                      <Text variant="body" style={styles.suggestionText}>{suggestion}</Text>
                    </View>
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
          <View style={styles.filterButtonContent}>
            <Ionicons 
              name={useLocationFilters ? 'location' : 'globe-outline'} 
              size={18} 
              color={useLocationFilters ? '#FFFFFF' : theme.colors.primary.main} 
            />
            <Text 
              variant="body" 
              weight="medium"
              color={useLocationFilters ? 'primary' : 'primary'}
              style={styles.filterButtonText}
            >
              {useLocationFilters ? 'Busca por Localização Ativa' : 'Buscar em Outras Cidades'}
            </Text>
          </View>
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

  vendorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },

  vendorText: {
    flex: 1,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  titleText: {
    flex: 1,
  },

  suggestionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  suggestionText: {
    flex: 1,
  },

  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  filterButtonText: {
    marginLeft: theme.spacing.xs,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
