import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import {
  Container,
  Text,
  Input,
  Button,
  Spacing,
  ErrorMessage,
} from '@/components';
import { useForm } from '@/hooks';
import { registerVendorSchema, RegisterVendorFormData } from '@/utils';
import { useAuthStore } from '@/store/auth.store';
import { theme } from '@/theme';
import { AuthStackParamList } from '@/navigation/types';

type RegisterVendorScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterVendor'>;

export const RegisterVendorScreen = () => {
  const navigation = useNavigation<RegisterVendorScreenNavigationProp>();
  const { register, error, clearError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterVendorFormData>(registerVendorSchema);

  const onSubmit = async (data: RegisterVendorFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'VENDOR',
        isAdult: true,
      });
      // Navigation happens automatically in RootNavigator
    } catch (err) {
      // Error is handled by store
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container safe padding>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Ionicons name="storefront" size={60} color={theme.colors.primary.main} />
            <Spacing size="md" />
            <Text variant="h2" weight="bold" center>
              Cadastro de Vendedor
            </Text>
            <Spacing size="xs" />
            <Text variant="body" color="secondary" center>
              Anuncie seus produtos e aumente suas vendas
            </Text>
          </View>

          <Spacing size="xl" />

          {error && (
            <>
              <ErrorMessage message={error} onRetry={clearError} retryLabel="OK" />
              <Spacing size="md" />
            </>
          )}

          <View style={styles.form}>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome do responsável"
                  placeholder="João Silva"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.name?.message}
                  editable={!isSubmitting}
                />
              )}
            />

            <Spacing size="md" />

            <Controller
              control={control}
              name="companyName"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Nome do estabelecimento"
                  placeholder="Bar do João"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.companyName?.message}
                  editable={!isSubmitting}
                />
              )}
            />

            <Spacing size="md" />

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="contato@estabelecimento.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  autoCapitalize="none"
                  editable={!isSubmitting}
                />
              )}
            />

            <Spacing size="md" />

            <Controller
              control={control}
              name="cnpj"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="CNPJ"
                  placeholder="00.000.000/0000-00"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.cnpj?.message}
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
              )}
            />

            <Spacing size="md" />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Senha"
                  type="password"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  helperText="Mínimo de 6 caracteres"
                  editable={!isSubmitting}
                />
              )}
            />

            <Spacing size="md" />

            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Confirmar senha"
                  type="password"
                  placeholder="••••••••"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.confirmPassword?.message}
                  editable={!isSubmitting}
                />
              )}
            />

            <Spacing size="xl" />

            <View style={styles.infoBox}>
              <Ionicons name="information-circle" size={24} color={theme.colors.info.main} />
              <Text variant="caption" color="secondary" style={styles.infoText}>
                Após o cadastro, você precisará completar as informações do seu estabelecimento (endereço, tipo, etc.) para começar a anunciar produtos.
              </Text>
            </View>

            <Spacing size="xl" />

            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Criar Conta de Vendedor
            </Button>

            <Spacing size="md" />

            <Button
              variant="ghost"
              onPress={() => navigation.navigate('Login')}
              disabled={isSubmitting}
            >
              <Text variant="body" color="secondary">
                Já tenho conta
              </Text>
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
  },
  form: {
    width: '100%',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
    gap: theme.spacing.sm,
  },
  infoText: {
    flex: 1,
    lineHeight: 20,
  },
});
