import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
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
import { MAP_CONFIG } from '@/constants';
import { theme } from '@/theme';

// Importação condicional do MapView
let MapView: any = null;
let Marker: any = null;
let Region: any = null;

try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
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

  const [region, setRegion] = useState<any>({
    latitude: MAP_CONFIG.DEFAULT_LATITUDE,
    longitude: MAP_CONFIG.DEFAULT_LONGITUDE,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

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

  const handleGetLocation = async () => {
    await getCurrentLocation();
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
              <Text variant="body" weight="bold" center>
                📍 Sua Localização Atual:
              </Text>
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
            icon={<Text>📍</Text>}
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
          Encontre vendedores próximos a você
        </Text>
      </View>

      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={permissionGranted}
        showsMyLocationButton={permissionGranted}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Você está aqui"
            pinColor={theme.colors.primary.main}
          />
        )}
      </MapView>

      <View style={styles.bottomControls}>
        <Button
          variant="primary"
          size="md"
          icon={<Text>📍</Text>}
          onPress={handleGetLocation}
        >
          Minha Localização
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
});
