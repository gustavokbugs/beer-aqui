import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
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

type RegisterScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigation = useNavigation<RegisterScreenNavigationProp>();
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
            <Text variant="h2" weight="bold" center>
              Criar Conta
            </Text>
            <Spacing size="xs" />
            <Text variant="body" color="secondary" center>
              Preencha seus dados para começar
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

            <Spacing size="md" />

            <Controller
              control={control}
              name="isAdult"
              defaultValue={false}
              render={({ field: { onChange, value } }) => (
                <View style={styles.checkboxContainer}>
                  <Button
                    variant={value ? 'primary' : 'outline'}
                    size="sm"
                    onPress={() => onChange(!value)}
                    disabled={isSubmitting}
                  >
                    {value ? t('auth:register.isAdultChecked') : t('auth:register.isAdult')}
                  </Button>
                  {errors.isAdult && (
                    <Text variant="caption" color="error" style={styles.checkboxError}>
                      {errors.isAdult.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Spacing size="xl" />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            >
              Criar conta
            </Button>

            <Spacing size="xl" />

            <View style={styles.footer}>
              <Text variant="body" color="secondary" center>
                Já tem uma conta?{' '}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => navigation.navigate('Login')}
                disabled={isSubmitting}
              >
                Fazer login
              </Button>
            </View>
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
    paddingVertical: theme.spacing.xl,
  },

  header: {
    alignItems: 'center',
  },

  form: {
    width: '100%',
  },

  checkboxContainer: {
    width: '100%',
  },

  checkboxError: {
    marginTop: theme.spacing.xs,
    marginLeft: theme.spacing.xs,
  },

  footer: {
    alignItems: 'center',
  },
});
