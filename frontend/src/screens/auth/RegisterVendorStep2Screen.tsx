import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Container,
  Text,
  Input,
  Button,
  Spacing,
  Card,
} from '@/components';
import { theme } from '@/theme';
import { vendorService } from '@/services/vendor.service';
import { useLocationStore } from '@/store/location.store';
import { AuthStackParamList } from '@/navigation/types';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'RegisterVendorStep2'>;

const VENDOR_TYPES = [
  { label: 'Bar', value: 'bar' },
  { label: 'Mercado', value: 'mercado' },
  { label: 'Distribuidora', value: 'distribuidora' },
];

export const RegisterVendorStep2Screen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { currentLocation } = useLocationStore();
  const [isLoading, setIsLoading] = useState(false);

  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [type, setType] = useState<'bar' | 'mercado' | 'distribuidora'>('bar');
  const [phone, setPhone] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');

  const formatCNPJ = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return cnpj;
  };

  const formatPhone = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2');
    }
    return phone;
  };

  const handleSubmit = async () => {
    // Validações básicas
    if (!companyName || !cnpj || !addressStreet || !addressNumber || !addressCity || !addressState) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Atenção', 'Não foi possível obter sua localização. Verifique as permissões do app.');
      return;
    }

    setIsLoading(true);
    try {
      await vendorService.create({
        companyName,
        cnpj: cnpj.replace(/\D/g, ''),
        type,
        phone: phone.replace(/\D/g, ''),
        addressStreet,
        addressNumber,
        addressCity,
        addressState,
        addressZip: addressZip || '00000-000',
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      });

      Alert.alert(
        'Sucesso!', 
        'Seu perfil de vendedor foi criado com sucesso. Agora você pode começar a cadastrar seus produtos!',
        [{ text: 'OK' }]
      );
      // Navigation happens automatically in RootNavigator after success
    } catch (err: any) {
      Alert.alert('Erro', err.response?.data?.message || err.message || 'Erro ao criar perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Completar mais tarde',
      'Você poderá completar seu perfil depois na aba de Produtos. Sem o perfil completo, não será possível cadastrar produtos.',
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Pular', onPress: () => {} }, // Will navigate automatically
      ]
    );
  };

  return (
    <Container safe padding>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h1" weight="bold">
            Etapa 2 de 2
          </Text>
          <Spacing size="xs" />
          <Text variant="h2" weight="semibold">
            Dados do Estabelecimento
          </Text>
          <Text variant="body" color="secondary">
            Preencha as informações do seu negócio
          </Text>
        </View>

        <Spacing size="lg" />

        <Card variant="elevated" padding="lg">
          <Text variant="h3" weight="semibold">
            Informações Básicas
          </Text>

          <Spacing size="md" />

          <Input
            label="Nome do Estabelecimento *"
            placeholder="Ex: Bar do João"
            value={companyName}
            onChangeText={setCompanyName}
            autoCapitalize="words"
          />

          <Spacing size="md" />

          <Input
            label="CNPJ *"
            placeholder="00.000.000/0000-00"
            value={cnpj}
            onChangeText={(text) => setCnpj(formatCNPJ(text))}
            keyboardType="number-pad"
            maxLength={18}
          />

          <Spacing size="md" />

          <Text variant="body" weight="semibold" style={styles.label}>
            Tipo de Estabelecimento *
          </Text>
          <Spacing size="xs" />
          <View style={styles.typeGrid}>
            {VENDOR_TYPES.map((option) => (
              <Button
                key={option.value}
                variant={type === option.value ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setType(option.value as any)}
                style={styles.typeButton}
              >
                <Text
                  variant="body"
                  weight="semibold"
                  style={{ color: type === option.value ? theme.colors.white : theme.colors.primary.main }}
                >
                  {option.label}
                </Text>
              </Button>
            ))}
          </View>

          <Spacing size="md" />

          <Input
            label="Telefone"
            placeholder="(00) 00000-0000"
            value={phone}
            onChangeText={(text) => setPhone(formatPhone(text))}
            keyboardType="phone-pad"
            maxLength={15}
          />
        </Card>

        <Spacing size="lg" />

        <Card variant="elevated" padding="lg">
          <Text variant="h3" weight="semibold">
            Endereço
          </Text>

          <Spacing size="md" />

          <Input
            label="Rua *"
            placeholder="Rua Principal"
            value={addressStreet}
            onChangeText={setAddressStreet}
            autoCapitalize="words"
          />

          <Spacing size="md" />

          <Input
            label="Número *"
            placeholder="123"
            value={addressNumber}
            onChangeText={setAddressNumber}
            keyboardType="number-pad"
          />

          <Spacing size="md" />

          <Input
            label="Cidade *"
            placeholder="Santa Cruz do Sul"
            value={addressCity}
            onChangeText={setAddressCity}
            autoCapitalize="words"
          />

          <Spacing size="md" />

          <Input
            label="Estado *"
            placeholder="RS"
            value={addressState}
            onChangeText={(text) => setAddressState(text.toUpperCase())}
            maxLength={2}
            autoCapitalize="characters"
          />

          <Spacing size="md" />

          <Input
            label="CEP"
            placeholder="00000-000"
            value={addressZip}
            onChangeText={setAddressZip}
            keyboardType="number-pad"
            maxLength={9}
          />

          <Spacing size="sm" />

          <Text variant="caption" color="secondary">
            * Campos obrigatórios
          </Text>
        </Card>

        <Spacing size="xl" />

        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!currentLocation}
        >
          Concluir Cadastro
        </Button>

        {!currentLocation && (
          <>
            <Spacing size="md" />
            <Text variant="caption" color="error" center>
              Aguardando localização...
            </Text>
          </>
        )}

        <Spacing size="md" />

        <Button
          variant="ghost"
          size="lg"
          onPress={handleSkip}
          disabled={isLoading}
        >
          <Text variant="body" color="secondary">
            Completar depois
          </Text>
        </Button>

        <Spacing size="xl" />
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.text.secondary,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  typeButton: {
    flex: 0,
    minWidth: '30%',
  },
});
