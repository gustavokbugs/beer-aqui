import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Container, Text, Input, Button, Spacing, Card, Loading, ErrorMessage } from '@/components';
import { VendorStackParamList } from '@/navigation/types';
import vendorService from '@/services/vendor.service';
import { theme } from '@/theme';
import { Vendor } from '@/types';

type NavigationProp = StackNavigationProp<VendorStackParamList, 'EditVendor'>;

export const EditVendorScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZip, setAddressZip] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await vendorService.getMyProfile();
      setVendor(data);
      setCompanyName(data.companyName || '');
      setPhone(data.phone || '');
      setAddressStreet(data.address?.street || '');
      setAddressNumber(data.address?.number || '');
      setAddressCity(data.address?.city || '');
      setAddressState(data.address?.state || '');
      setAddressZip(data.address?.zip || '');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erro ao carregar empresa');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!vendor) return;

    if (!companyName.trim()) {
      Alert.alert('Erro', 'Informe o nome da empresa');
      return;
    }

    if (!addressStreet.trim() || !addressNumber.trim() || !addressCity.trim() || !addressState.trim() || !addressZip.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos de endereço');
      return;
    }

    setIsSubmitting(true);
    try {
      await vendorService.update(vendor.id, {
        companyName: companyName.trim(),
        phone: phone.trim() || undefined,
        addressStreet: addressStreet.trim(),
        addressNumber: addressNumber.trim(),
        addressCity: addressCity.trim(),
        addressState: addressState.trim().toUpperCase(),
        addressZip: addressZip.replace(/\D/g, ''),
      });
      Alert.alert('Sucesso', 'Dados da empresa atualizados com sucesso', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || err?.message || 'Erro ao atualizar empresa');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Carregando empresa..." />;
  }

  if (error) {
    return (
      <Container safe padding center>
        <ErrorMessage message={error} onRetry={loadProfile} retryLabel="Tentar novamente" />
      </Container>
    );
  }

  return (
    <Container safe padding>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h1" weight="bold">Editar Empresa</Text>
          <Text variant="body" color="secondary">Atualize os dados do seu estabelecimento</Text>
        </View>

        <Spacing size="lg" />

        <Card variant="elevated" padding="lg">
          <Input label="Nome da empresa" value={companyName} onChangeText={setCompanyName} />
          <Spacing size="md" />
          <Input label="Telefone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          <Spacing size="md" />
          <Input label="Rua" value={addressStreet} onChangeText={setAddressStreet} />
          <Spacing size="md" />
          <Input label="Número" value={addressNumber} onChangeText={setAddressNumber} />
          <Spacing size="md" />
          <Input label="Cidade" value={addressCity} onChangeText={setAddressCity} />
          <Spacing size="md" />
          <Input label="Estado" value={addressState} onChangeText={setAddressState} autoCapitalize="characters" maxLength={2} />
          <Spacing size="md" />
          <Input label="CEP" value={addressZip} onChangeText={setAddressZip} keyboardType="number-pad" />
        </Card>

        <Spacing size="xl" />

        <Button onPress={handleSubmit} loading={isSubmitting}>Salvar alterações</Button>
        <Spacing size="md" />
        <Button variant="ghost" onPress={() => navigation.goBack()}>Voltar</Button>
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.sm,
  },
});
