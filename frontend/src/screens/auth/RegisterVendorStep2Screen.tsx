import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
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
import { useAuthStore } from '@/store/auth.store';
import { AuthStackParamList } from '@/navigation/types';
import { formatCNPJ, validateCNPJ } from '@/utils/formatters';

type NavigationProp = StackNavigationProp<AuthStackParamList, 'RegisterVendorStep2'>;
type RoutePropType = RouteProp<AuthStackParamList, 'RegisterVendorStep2'>;

const VENDOR_TYPES = [
  { label: 'Bar', value: 'bar' },
  { label: 'Mercado', value: 'mercado' },
  { label: 'Distribuidora', value: 'distribuidora' },
];

export const RegisterVendorStep2Screen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { register } = useAuthStore();
  const { 
    currentLocation, 
    getCurrentLocation, 
    isLoading: locationLoading,
    error: locationError,
  } = useLocationStore();
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
  const [cnpjError, setCnpjError] = useState<string | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [addressNeighborhood, setAddressNeighborhood] = useState('');

  // Request location when screen loads
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Validate CNPJ when it changes
  useEffect(() => {
    if (cnpj.length === 0) {
      setCnpjError(null);
      return;
    }
    
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length < 14) {
      setCnpjError(null); // Don't show error while typing
      return;
    }
    
    if (!validateCNPJ(cnpj)) {
      setCnpjError('CNPJ inválido');
    } else {
      setCnpjError(null);
    }
  }, [cnpj]);

  const handleCnpjChange = (text: string) => {
    const formatted = formatCNPJ(text);
    setCnpj(formatted);
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

  const formatCep = (text: string) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return addressZip;
  };

  const handleCepChange = async (text: string) => {
    const formatted = formatCep(text);
    setAddressZip(formatted);

    const cleanCep = text.replace(/\D/g, '');
    
    // Limpa campos se CEP estiver sendo editado
    if (cleanCep.length < 8 && cleanCep.length > 0) {
      // Não limpa para não apagar dados enquanto digita
    } else if (cleanCep.length === 0) {
      // Limpa todos os campos se o CEP for apagado
      setAddressStreet('');
      setAddressCity('');
      setAddressState('');
      setAddressNeighborhood('');
    }
    
    // Busca CEP quando tiver 8 dígitos
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await response.json();

        if (!data.erro) {
          setAddressStreet(data.logradouro || '');
          setAddressCity(data.localidade || '');
          setAddressState(data.uf || '');
          setAddressNeighborhood(data.bairro || '');
        } else {
          Alert.alert('CEP não encontrado', 'Por favor, verifique o CEP digitado ou preencha manualmente.');
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error);
        Alert.alert('Erro', 'Não foi possível buscar o CEP. Você pode preencher manualmente.');
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const handleSubmit = async () => {
    // Validações básicas
    if (!companyName || !cnpj || !addressZip || !addressStreet || !addressNumber || !addressCity || !addressState) {
      Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Validate CNPJ
    if (!validateCNPJ(cnpj)) {
      Alert.alert('Erro', 'Por favor, insira um CNPJ válido');
      return;
    }

    // Validate CEP (must have 8 digits)
    const cleanCep = addressZip.replace(/\D/g, '');
    if (cleanCep.length !== 8) {
      Alert.alert('Erro', 'Por favor, insira um CEP válido com 8 dígitos');
      return;
    }

    if (!currentLocation) {
      Alert.alert('Atenção', 'Não foi possível obter sua localização. Verifique as permissões do app.');
      return;
    }

    // Verifica se recebeu os dados da etapa 1
    const { name, email, password } = route.params;
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Dados da etapa anterior não encontrados. Por favor, volte e preencha novamente.');
      navigation.goBack();
      return;
    }

    setIsLoading(true);
    try {
      // First, register the user account
      console.log('Starting registration with:', { name, email, role: 'VENDOR' });
      await register({
        name,
        email,
        password,
        role: 'VENDOR',
        isAdult: true,
      });

      console.log('User registered successfully, creating vendor profile...');

      // After successful registration, create vendor profile
      const vendorData = {
        companyName,
        cnpj: cnpj.replace(/\D/g, ''),
        type,
        phone: phone ? phone.replace(/\D/g, '') : undefined,
        addressStreet,
        addressNumber,
        addressCity,
        addressState: addressState.toUpperCase().substring(0, 2),
        addressZip: addressZip.replace(/\D/g, ''),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
      };
      
      console.log('Vendor data to send:', JSON.stringify(vendorData, null, 2));
      
      await vendorService.create(vendorData);

      Alert.alert(
        'Sucesso!', 
        'Seu perfil de vendedor foi criado com sucesso. Agora você pode começar a cadastrar seus produtos!',
        [{ text: 'OK' }]
      );
      // Navigation happens automatically in RootNavigator after successful registration
    } catch (err: any) {
      console.error('Error in vendor registration:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Erro ao criar perfil';
      
      if (err.response?.data?.details) {
        // Se houver detalhes de validação, mostre-os
        const details = err.response.data.details.map((d: any) => `${d.field}: ${d.message}`).join('\n');
        errorMessage = `Dados inválidos:\n${details}`;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Cancelar cadastro?',
      'Se você voltar agora, precisará preencher os dados novamente.',
      [
        { text: 'Continuar aqui', style: 'cancel' },
        { text: 'Voltar', onPress: () => navigation.goBack() },
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
            onChangeText={handleCnpjChange}
            keyboardType="number-pad"
            maxLength={18}
            error={cnpjError || undefined}
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
            label="CEP *"
            placeholder="00000-000"
            value={addressZip}
            onChangeText={handleCepChange}
            keyboardType="number-pad"
            maxLength={9}
            helperText={isLoadingCep ? "🔍 Buscando endereço..." : "Digite o CEP para buscar automaticamente"}
          />

          {isLoadingCep && (
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <ActivityIndicator size="small" color={theme.colors.primary.main} />
            </View>
          )}

          <Spacing size="md" />

          <Input
            label="Rua *"
            placeholder="Rua Principal"
            value={addressStreet}
            onChangeText={setAddressStreet}
            autoCapitalize="words"
            editable={!isLoadingCep}
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
            label="Bairro"
            placeholder="Centro"
            value={addressNeighborhood}
            onChangeText={setAddressNeighborhood}
            autoCapitalize="words"
            editable={!isLoadingCep}
          />

          <Spacing size="md" />

          <Input
            label="Cidade *"
            placeholder="Santa Cruz do Sul"
            value={addressCity}
            onChangeText={setAddressCity}
            autoCapitalize="words"
            editable={!isLoadingCep}
          />

          <Spacing size="md" />

          <Input
            label="Estado *"
            placeholder="RS"
            value={addressState}
            onChangeText={(text) => setAddressState(text.toUpperCase())}
            maxLength={2}
            autoCapitalize="characters"
            editable={!isLoadingCep}
          />

          <Spacing size="sm" />

          <Text variant="caption" color="secondary">
            * Campos obrigatórios
          </Text>
        </Card>

        <Spacing size="lg" />

        <Card variant="elevated" padding="md" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text variant="caption" color="secondary">
              📍 Sua localização é usada para que clientes próximos possam encontrar seu estabelecimento no mapa.
              {currentLocation && ' Você pode ajustar o endereço acima se necessário.'}
            </Text>
          </View>
        </Card>

        <Spacing size="xl" />

        {locationLoading && (
          <>
            <Text variant="caption" color="secondary" center>
              🌍 Obtendo sua localização...
            </Text>
            <Spacing size="md" />
          </>
        )}

        {currentLocation && !locationLoading && (
          <>
            <Text variant="caption" color="secondary" center style={{ color: theme.colors.success.main }}>
              ✓ Localização obtida com sucesso
            </Text>
            <Spacing size="md" />
          </>
        )}

        {!currentLocation && !locationLoading && (
          <>
            <Text variant="caption" color="error" center>
              {locationError || 'Não foi possível obter sua localização'}
            </Text>
            <Spacing size="sm" />
            <Button
              variant="outline"
              size="sm"
              onPress={getCurrentLocation}
            >
              Tentar novamente
            </Button>
            <Spacing size="md" />
          </>
        )}

        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          loading={isLoading}
          disabled={!currentLocation || isLoading || !!cnpjError}
        >
          Concluir Cadastro
        </Button>

        {cnpjError && cnpj.replace(/\D/g, '').length === 14 && (
          <>
            <Spacing size="sm" />
            <Text variant="caption" color="error" center>
              ⚠️ {cnpjError}
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
            Voltar à etapa anterior
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
  infoCard: {
    backgroundColor: '#E3F2FD',
    borderWidth: 1,
    borderColor: theme.colors.info.main,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
