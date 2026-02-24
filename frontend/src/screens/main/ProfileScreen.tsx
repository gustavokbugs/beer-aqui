import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';import { Ionicons } from '@expo/vector-icons';import {
  Container,
  Text,
  Card,
  Button,
  Spacing,
} from '@/components';
import { useAuthStore } from '@/store/auth.store';
import { theme } from '@/theme';

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Container safe padding>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h2" weight="bold">
            Perfil 👤
          </Text>
        </View>

        <Spacing size="xl" />

        <Card variant="elevated" padding="lg">
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text variant="h1">👤</Text>
            </View>
          </View>

          <Spacing size="md" />

          <Text variant="h3" weight="bold" center>
            {user?.name || 'Usuário'}
          </Text>

          <Spacing size="xs" />

          <Text variant="body" color="secondary" center>
            {user?.email || 'email@exemplo.com'}
          </Text>

          <Spacing size="sm" />

          <View style={styles.badge}>
            <Text variant="caption" color="primary" weight="medium">
              {user?.role || 'CLIENT'}
            </Text>
          </View>
        </Card>

        <Spacing size="xl" />

        <Card variant="outlined" padding="md">
          <Text variant="label" color="secondary">
            CONFIGURAÇÕES
          </Text>
          <Spacing size="md" />

          <View style={styles.menuItem}>
            <Ionicons name="location-outline" size={20} color={theme.colors.text.primary} />
            <Text variant="body" style={styles.menuText}>Endereços</Text>
          </View>

          <Spacing size="sm" />

          <View style={styles.menuItem}>
            <Ionicons name="notifications-outline" size={20} color={theme.colors.text.primary} />
            <Text variant="body" style={styles.menuText}>Notificações</Text>
          </View>

          <Spacing size="sm" />

          <View style={styles.menuItem}>
            <Ionicons name="globe-outline" size={20} color={theme.colors.text.primary} />
            <Text variant="body" style={styles.menuText}>Idioma</Text>
          </View>

          <Spacing size="sm" />

          <View style={styles.menuItem}>
            <Text variant="body">ℹ️ Sobre</Text>
          </View>
        </Card>

        <Spacing size="xl" />

        <Button
          variant="danger"
          size="lg"
          fullWidth
          onPress={handleLogout}
        >
          Sair
        </Button>

        <Spacing size="xl" />

        <Text variant="caption" color="light" center>
          BeerAqui v1.0.0
        </Text>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.md,
  },

  avatarContainer: {
    alignItems: 'center',
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },

  badge: {
    alignSelf: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary.main + '20',
    borderRadius: theme.borderRadius.round,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },

  menuText: {
    flex: 1,
  },
});
