import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Container, Text, Spacing } from '@/components';
import { theme } from '@/theme';

export const FavoritesScreen = () => {
  return (
    <Container safe padding>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="star" size={28} color={theme.colors.primary.main} />
          <Text variant="h2" weight="bold">
            Favoritos
          </Text>
        </View>
        <Spacing size="xs" />
        <Text variant="body" color="secondary">
          Seus produtos favoritos
        </Text>
      </View>

      <View style={styles.emptyState}>
        <Ionicons name="star-outline" size={80} color={theme.colors.secondary.main} />
        <Spacing size="md" />
        <Text variant="h3" center color="secondary">
          Nenhum favorito ainda
        </Text>
        <Spacing size="sm" />
        <Text variant="body" center color="light">
          Comece a favoritar produtos para vê-los aqui
        </Text>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.xl,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
