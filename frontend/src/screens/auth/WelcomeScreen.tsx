import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Container, Text, Button, Spacing } from '@/components';
import { theme } from '@/theme';
import { AuthStackParamList } from '@/navigation/types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Welcome'>;

export const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <Container style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Icon Area */}
        <View style={styles.iconContainer}>
          <Ionicons name="beer-outline" size={120} color={theme.colors.primary.main} />
        </View>

        {/* Welcome Text */}
        <Text variant="h1" center color="primary" style={styles.title}>
          Beer Aqui
        </Text>
        
        <Spacing size="md" />
        
        <Text center color="secondary" style={styles.subtitle}>
          Cerveja gelada pertinho de você
        </Text>

        <Spacing size="sm" />

        <Text variant="body" center color="light" style={styles.description}>
          Compare preços, encontre promoções e economize na sua cerveja favorita
        </Text>

        <Spacing size="xl" />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button 
            onPress={() => navigation.navigate('RegisterClient')}
            style={styles.primaryButton}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="beer" size={24} color="#FFFFFF" />
              <Text variant="body" weight="semibold" style={[styles.buttonText, styles.primaryButtonText]}>
                Quero cerveja barata!
              </Text>
            </View>
          </Button>

          <Spacing size="md" />

          <Button 
            variant="outline"
            onPress={() => navigation.navigate('RegisterVendor')}
            style={styles.secondaryButton}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="storefront-outline" size={24} color={theme.colors.primary.main} />
              <Text variant="body" weight="semibold" style={[styles.buttonText, styles.outlineButtonText]}>
                Quero vender!
              </Text>
            </View>
          </Button>
        </View>

        <Spacing size="xl" />

        {/* Login Link */}
        <Button
          variant="ghost"
          onPress={() => navigation.navigate('Login')}
        >
          <Text variant="body" color="secondary">
            Já sou usuário
          </Text>
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  iconContainer: {
    marginBottom: 0,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    zIndex: 1,
  },
  subtitle: {
    fontSize: 20,
  },
  description: {
    fontSize: 16,
    paddingHorizontal: theme.spacing.md,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 400,
  },
  primaryButton: {
    paddingVertical: theme.spacing.md,
  },
  secondaryButton: {
    paddingVertical: theme.spacing.md,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  outlineButtonText: {
    color: theme.colors.primary.main,
  },
});
