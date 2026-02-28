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
import { registerSchema, RegisterFormData } from '@/utils';
import { useAuthStore } from '@/store/auth.store';
import { theme } from '@/theme';
import { AuthStackParamList } from '@/navigation/types';

type RegisterClientScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'RegisterClient'>;

export const RegisterClientScreen = () => {
  const navigation = useNavigation<RegisterClientScreenNavigationProp>();
  const { register, error, clearError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>(registerSchema);

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'CLIENT',
        isAdult: data.isAdult,
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
            <Ionicons name="beer" size={60} color={theme.colors.primary.main} />
            <Spacing size="md" />
            <Text variant="h2" weight="bold" center>
              Cadastro de Cliente
            </Text>
            <Spacing size="xs" />
            <Text variant="body" color="secondary" center>
              Encontre as melhores ofertas de cerveja
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
                  label="Nome completo"
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
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
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
                  helperText="Mínimo de 8 caracteres"
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

            <Spacing size="md" />

            <Controller
              control={control}
              name="isAdult"
              defaultValue={false}
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxContainer}>
                  <Button
                    variant="ghost"
                    onPress={() => onChange(!value)}
                    disabled={isSubmitting}
                    style={styles.checkbox}
                  >
                    <View style={styles.checkboxRow}>
                      <View style={[styles.checkboxBox, value && styles.checkboxBoxChecked]}>
                        {value && <Ionicons name="checkmark" size={18} color="#FFFFFF" />}
                      </View>
                      <Text variant="body" style={styles.checkboxText}>
                        Confirmo que sou maior de 18 anos
                      </Text>
                    </View>
                  </Button>
                  {errors.isAdult && (
                    <Text variant="caption" color="error" style={styles.errorText}>
                      {errors.isAdult.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Spacing size="xl" />

            <Button
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              loading={isSubmitting}
            >
              Criar Conta
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
  checkboxContainer: {
    width: '100%',
  },
  checkbox: {
    paddingVertical: 0,
    paddingHorizontal: 0,
    alignItems: 'flex-start',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: theme.colors.gray[200],
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  checkboxText: {
    flex: 1,
  },
  errorText: {
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.lg,
  },
});
