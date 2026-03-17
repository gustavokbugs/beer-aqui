import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Container, Text, Input, Button, Spacing, Card, Loading, ErrorMessage } from '@/components';
import { VendorStackParamList } from '@/navigation/types';
import { productService } from '@/services/product.service';
import { Product } from '@/types';
import { theme } from '@/theme';

type NavigationProp = StackNavigationProp<VendorStackParamList, 'EditProduct'>;
type RouteProps = RouteProp<VendorStackParamList, 'EditProduct'>;

export const EditProductScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await productService.getById(productId);
      setProduct(response.product);
      setPrice(String(response.product.price));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Erro ao carregar produto');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    const parsedPrice = Number(price.replace(',', '.'));
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      Alert.alert('Erro', 'Informe um preço válido');
      return;
    }

    setIsSubmitting(true);
    try {
      await productService.updatePrice(productId, parsedPrice);
      Alert.alert('Sucesso', 'Preço atualizado com sucesso', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Erro', err?.response?.data?.message || err?.message || 'Erro ao atualizar preço');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading fullScreen message="Carregando produto..." />;
  }

  if (error || !product) {
    return (
      <Container safe padding center>
        <ErrorMessage message={error || 'Produto não encontrado'} onRetry={loadProduct} retryLabel="Tentar novamente" />
      </Container>
    );
  }

  return (
    <Container safe padding>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="h1" weight="bold">Editar Produto</Text>
          <Text variant="body" color="secondary">Atualize o preço do produto</Text>
        </View>

        <Spacing size="lg" />

        <Card variant="elevated" padding="lg">
          <Text variant="h3" weight="semibold">{product.brand}</Text>
          <Spacing size="xs" />
          <Text variant="caption" color="secondary">{product.volume}ml</Text>
          <Spacing size="md" />
          <Input label="Preço" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
        </Card>

        <Spacing size="xl" />

        <Button onPress={handleSubmit} loading={isSubmitting}>Salvar preço</Button>
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
