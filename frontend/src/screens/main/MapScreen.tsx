import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Text,
  Button,
  Loading,
  ErrorMessage,
  Spacing,
  Card,
} from '@/components';
import { useLocationStore } from '@/store/location.store';
import { useVendorStore } from '@/store/vendor.store';
import { MAP_CONFIG } from '@/constants';
import { theme } from '@/theme';
import { Vendor } from '@/types';

// Importação condicional do MapView
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;
let Region: any = null;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  Callout = maps.Callout;
  Region = maps.Region;
} catch (e) {
  // react-native-maps não disponível no Expo Go
}

export const MapScreen = () => {
  const {
    currentLocation,
    permissionGranted,
    isLoading,
    error,
    requestPermission,
    getCurrentLocation,
  } = useLocationStore();

  const {
    vendors,
    selectedVendor,
    isLoading: isLoadingVendors,
    searchNearby,
    selectVendor,
  } = useVendorStore();

  const [region, setRegion] = useState<any>({
    latitude: MAP_CONFIG.DEFAULT_LATITUDE,
    longitude: MAP_CONFIG.DEFAULT_LONGITUDE,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [searchRadius, setSearchRadius] = useState(5); // 5km de raio padrão

  // Verifica se o MapView está disponível
  const isMapAvailable = MapView !== null;

  useEffect(() => {
    initializeMap();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      setRegion({
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      // Busca vendors próximos quando consegue a localização
      loadNearbyVendors(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation]);

  const initializeMap = async () => {
    if (!permissionGranted) {
      const granted = await requestPermission();
      if (granted) {
        await getCurrentLocation();
      }
    } else {
      await getCurrentLocation();
    }
  };

  const loadNearbyVendors = async (latitude: number, longitude: number) => {
    await searchNearby({
      latitude,
      longitude,
      radiusKm: searchRadius,
    });
  };

  const handleGetLocation = async () => {
    await getCurrentLocation();
  };

  const handleMarkerPress = (vendor: Vendor) => {
    selectVendor(vendor);
  };

  const getMarkerColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'bar':
        return '#FF6B6B';
      case 'restaurant':
        return '#4ECDC4';
      case 'store':
        return '#FFE66D';
      case 'supermarket':
        return '#95E1D3';
      default:
        return theme.colors.primary.main;
    }
  };

  const formatDistance = (distanceInMeters?: number) => {
    if (!distanceInMeters) return '';
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`;
    }
    return `${(distanceInMeters / 1000).toFixed(1)}km`;
  };

  if (isLoading) {
    return <Loading fullScreen message="Obtendo sua localização..." />;
  }

  if (error && !currentLocation) {
    return (
      <Container safe padding center>
        <ErrorMessage
          title="Erro de Localização"
          message={error}
          onRetry={handleGetLocation}
          retryLabel="Tentar novamente"
        />
      </Container>
    );
  }

  // Se o MapView não estiver disponível (Expo Go), mostra mensagem informativa
  if (!isMapAvailable) {
    return (
      <Container safe padding>
        <View style={styles.header}>
          <Text variant="h2" weight="bold">
            Mapa 🗺️
          </Text>
          <Spacing size="xs" />
          <Text variant="caption" color="secondary">
            Encontre vendedores próximos a você
          </Text>
        </View>

        <Spacing size="lg" />

        <Card variant="outlined" padding="lg">
          <Text variant="h3" weight="bold" center color="secondary">
            📱 Funcionalidade de Mapa
          </Text>
          <Spacing size="md" />
          <Text variant="body" center color="secondary">
            O mapa interativo requer uma build nativa customizada.
          </Text>
          <Spacing size="sm" />
          <Text variant="caption" center color="light">
            Para usar esta funcionalidade, você precisa criar uma build de desenvolvimento com:
          </Text>
          <Spacing size="md" />
          <Text variant="caption" color="light">
            • npx expo prebuild{'\n'}
            • npx expo run:android ou npx expo run:ios
          </Text>
          <Spacing size="lg" />
          
          {currentLocation && (
            <>
              <View style={styles.locationInfo}>
                <Ionicons name="location" size={20} color={theme.colors.primary.main} />
                <Text variant="body" weight="bold">
                  Sua Localização Atual:
                </Text>
              </View>
              <Spacing size="sm" />
              <Text variant="caption" center color="secondary">
                Latitude: {currentLocation.latitude.toFixed(6)}
              </Text>
              <Text variant="caption" center color="secondary">
                Longitude: {currentLocation.longitude.toFixed(6)}
              </Text>
              <Spacing size="md" />
            </>
          )}

          <Button
            variant="primary"
            size="md"
            icon={<Ionicons name="location" size={20} color="#FFFFFF" />}
            onPress={handleGetLocation}
          >
            {currentLocation ? 'Atualizar Localização' : 'Obter Localização'}
          </Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container safe padding={false}>
      <View style={styles.header}>
        <Text variant="h2" weight="bold">
          Mapa 🗺️
        </Text>
        <Spacing size="xs" />
        <Text variant="caption" color="secondary">
          {vendors.length > 0 
            ? `${vendors.length} estabelecimento${vendors.length > 1 ? 's' : ''} próximo${vendors.length > 1 ? 's' : ''}`
            : 'Encontre vendedores próximos a você'
          }
        </Text>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={permissionGranted}
        showsMyLocationButton={permissionGranted}
      >
        {/* Marcador da localização do usuário */}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Você está aqui"
            description="Sua localização atual"
            pinColor={theme.colors.primary.main}
          />
        )}

        {/* Marcadores dos estabelecimentos */}
        {vendors.map((vendor) => {
          const lat = vendor.latitude || vendor.location?.latitude;
          const lon = vendor.longitude || vendor.location?.longitude;
          
          if (!lat || !lon) return null;

          return (
            <Marker
              key={vendor.id}
              coordinate={{
                latitude: lat,
                longitude: lon,
              }}
              pinColor={getMarkerColor(vendor.type)}
              onPress={() => handleMarkerPress(vendor)}
            >
              <Callout tooltip>
                <View style={styles.calloutContainer}>
                  <Text variant="body" weight="bold" numberOfLines={1}>
                    {vendor.companyName}
                  </Text>
                  <Spacing size="xs" />
                  <Text variant="caption" color="secondary">
                    {vendor.type} {vendor.distance ? `• ${formatDistance(vendor.distance)}` : ''}
                  </Text>
                  {vendor.address && (
                    <>
                      <Spacing size="xs" />
                      <Text variant="caption" color="light" numberOfLines={2}>
                        {vendor.address.street}, {vendor.address.number} - {vendor.address.city}
                      </Text>
                    </>
                  )}
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      {/* Card de detalhes do vendor selecionado */}
      {selectedVendor && (
        <View style={styles.detailsCard}>
          <Card variant="elevated" padding="md">
            <View style={styles.detailsHeader}>
              <View style={styles.detailsInfo}>
                <Text variant="h3" weight="bold" numberOfLines={1}>
                  {selectedVendor.companyName}
                </Text>
                <Spacing size="xs" />
                <View style={styles.badgeContainer}>
                  <View style={[styles.badge, { backgroundColor: getMarkerColor(selectedVendor.type) }]}>
                    <Text variant="caption" style={styles.badgeText}>
                      {selectedVendor.type}
                    </Text>
                  </View>
                  {selectedVendor.distance && (
                    <Text variant="caption" color="secondary">
                      {formatDistance(selectedVendor.distance)}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={() => selectVendor(null)}>
                <Ionicons name="close-circle" size={28} color={theme.colors.gray[400]} />
              </TouchableOpacity>
            </View>
            
            {selectedVendor.address && (
              <>
                <Spacing size="sm" />
                <View style={styles.addressRow}>
                  <Ionicons name="location-outline" size={16} color={theme.colors.gray[600]} />
                  <Text variant="caption" color="secondary" style={styles.addressText}>
                    {selectedVendor.address.street}, {selectedVendor.address.number} - {selectedVendor.address.city}
                  </Text>
                </View>
              </>
            )}
            
            {selectedVendor.phone && (
              <>
                <Spacing size="xs" />
                <View style={styles.addressRow}>
                  <Ionicons name="call-outline" size={16} color={theme.colors.gray[600]} />
                  <Text variant="caption" color="secondary">
                    {selectedVendor.phone}
                  </Text>
                </View>
              </>
            )}
          </Card>
        </View>
      )}

      <View style={styles.bottomControls}>
        <Button
          variant="primary"
          size="md"
          icon={<Ionicons name="location" size={20} color="#FFFFFF" />}
          onPress={handleGetLocation}
          disabled={isLoading || isLoadingVendors}
        >
          {isLoadingVendors ? 'Buscando...' : 'Minha Localização'}
        </Button>
      </View>
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

  map: {
    flex: 1,
  },

  bottomControls: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },

  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },

  calloutContainer: {
    backgroundColor: 'white',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    minWidth: 200,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  detailsCard: {
    position: 'absolute',
    top: 80,
    left: theme.spacing.md,
    right: theme.spacing.md,
    zIndex: 1000,
  },

  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  detailsInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },

  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },

  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
  },

  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.xs,
  },

  addressText: {
    flex: 1,
  },
});
