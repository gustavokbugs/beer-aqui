import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Container, Text, Input, Button, Spacing, Card, Loading, ErrorMessage } from '@/components';
import { VendorStackParamList } from '@/navigation/types';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { adService } from '@/services/ad.service';
import { theme } from '@/theme';

type NavigationProp = StackNavigationProp<VendorStackParamList, 'CreateAd'>;
type RouteProps = RouteProp<VendorStackParamList, 'CreateAd'>;

export const CreateAdScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState(route.params?.productId || '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [priority, setPriority] = useState('5');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  );

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getMyProducts(false);
      const activeProducts = (response.products || []).filter((product) => product.isActive);
      setProducts(activeProducts);
      if (!productId && activeProducts.length > 0) {
        setProductId(activeProducts[0].id);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const validateDate = (value: string): boolean => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const handleSubmit = async () => {
    if (!productId) {
      Alert.alert('Erro', 'Selecione um produto');
      return;
    }

    if (!validateDate(startDate) || !validateDate(endDate)) {
      Alert.alert('Erro', 'Use o formato de data YYYY-MM-DD');
      return;
    }

    const priorityValue = Number(priority);
    if (!Number.isInteger(priorityValue) || priorityValue < 1 || priorityValue > 10) {
      Alert.alert('Erro', 'A prioridade deve ser um número entre 1 e 10');
      return;
    }

    const startIso = `${startDate}T00:00:00.000Z`;
    const endIso = `${endDate}T23:59:59.000Z`;

    setIsSubmitting(true);
    try {
      await adService.create({
        productId,
        startDate: startIso,
        endDate: endIso,
        priority: priorityValue,
      });

      Alert.alert('Sucesso', 'Anúncio criado com sucesso!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('ManageAds'),
        },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || err?.message || 'Erro ao criar anúncio');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Carregando produtos..." />;
  }

  if (error) {
    return (
      <Container safe padding center>
        <ErrorMessage message={error} onRetry={loadProducts} retryLabel="Tentar novamente" />
      </Container>
    );
  }

  return (
    <Container safe padding>
      <View style={styles.header}>
        <Text variant="h1" weight="bold">Criar anúncio</Text>
        <Text variant="body" color="secondary">Escolha o produto e o período</Text>
      </View>

      <Spacing size="lg" />

      <Card variant="elevated" padding="lg">
        <Text variant="label" color="secondary">Produto</Text>
        <Spacing size="xs" />

        {products.length === 0 ? (
          <Text variant="body" color="secondary">Nenhum produto ativo disponível.</Text>
        ) : (
          <View style={styles.productList}>
            {products.map((product) => (
              <Button
                key={product.id}
                variant={productId === product.id ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setProductId(product.id)}
                style={styles.productButton}
              >
                {product.brand} {product.volume}ml
              </Button>
            ))}
          </View>
        )}

        <Spacing size="md" />

        <Input
          label="Data de início"
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChangeText={setStartDate}
          autoCapitalize="none"
        />

        <Spacing size="md" />

        <Input
          label="Data de término"
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChangeText={setEndDate}
          autoCapitalize="none"
        />

        <Spacing size="md" />

        <Input
          label="Prioridade (1 a 10)"
          placeholder="5"
          value={priority}
          onChangeText={setPriority}
          keyboardType="number-pad"
        />

        {selectedProduct && (
          <>
            <Spacing size="md" />
            <Text variant="caption" color="secondary">
              Produto selecionado: {selectedProduct.brand} {selectedProduct.volume}ml
            </Text>
          </>
        )}
      </Card>

      <Spacing size="xl" />

      <Button onPress={handleSubmit} loading={isSubmitting} disabled={products.length === 0}>
        Criar anúncio
      </Button>

      <Spacing size="md" />

      <Button variant="ghost" onPress={() => navigation.navigate('ManageAds')}>
        Voltar
      </Button>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.sm,
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  productButton: {
    flexShrink: 1,
  },
});
