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
import { loginSchema, LoginFormData } from '@/utils';
import { useAuthStore } from '@/store/auth.store';
import { theme } from '@/theme';
import { AuthStackParamList } from '@/navigation/types';

type LoginScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, error, clearError } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>(loginSchema);

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    clearError();

    try {
      await login(data);
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
            <Text variant="h1" weight="bold" color="primary" center>
              🍺
            </Text>
            <Spacing size="sm" />
            <Text variant="h1" weight="bold" center>
              {t('common:common.appName')}
            </Text>
            <Spacing size="xs" />
            <Text variant="body" color="secondary" center>
              {t('common:common.tagline')}
            </Text>
          </View>

          <Spacing size="xl" />

          {error && (
            <>
              <ErrorMessage message={error} onRetry={clearError} retryLabel={t('common:common.ok')} />
              <Spacing size="md" />
            </>
          )}

          <View style={styles.form}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('auth:login.email')}
                  type="email"
                  placeholder={t('auth:login.emailPlaceholder')}
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
                  label={t('auth:login.password')}
                  type="password"
                  placeholder={t('auth:login.passwordPlaceholder')}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  editable={!isSubmitting}
                />
              )}
            />

            <Spacing size="lg" />

            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            >
              {t('auth:login.loginButton')}
            </Button>

            <Spacing size="xl" />

            <View style={styles.footer}>
              <Text variant="body" color="secondary" center>
                {t('auth:login.noAccount')}{' '}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                onPress={() => navigation.navigate('Register')}
                disabled={isSubmitting}
              >
                {t('auth:login.signUp')}
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
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },

  header: {
    alignItems: 'center',
  },

  form: {
    width: '100%',
  },

  footer: {
    alignItems: 'center',
  },
});
