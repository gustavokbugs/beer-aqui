import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Container,
  Text,
  Input,
  Button,
  Spacing,
  Card,
  Loading,
} from '@/components';
import { theme } from '@/theme';
import { formatCurrencyInput, parseCurrencyInput } from '@/utils';
import { productService } from '@/services/product.service';
import { VendorStackParamList } from '@/navigation/types';

type NavigationProp = StackNavigationProp<VendorStackParamList, 'EditProduct'>;
type RoutePropType = RouteProp<VendorStackParamList, 'EditProduct'>;

const VOLUME_OPTIONS = [
  { label: '269ml (Lata)', value: 269 },
  { label: '350ml (Lata)', value: 350 },
  { label: '473ml (Lata)', value: 473 },
  { label: '330ml (Long Neck)', value: 330 },
  { label: '600ml (Garrafa)', value: 600 },
  { label: '1000ml (Litro)', value: 1000 },
];

export const EditProductScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { productId } = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [brand, setBrand] = useState('');
  const [volume, setVolume] = useState('350');
  const [price, setPrice] = useState('0,00');
  const [stockQuantity, setStockQuantity] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setIsLoadingProduct(true);
      const { product } = await productService.getById(productId);
      
      setBrand(product.brand);
      setVolume(product.volume?.toString() || product.volumeMl?.toString() || '350');
      setPrice(formatCurrencyInput((product.price * 100).toString()));
      setStockQuantity(product.stockQuantity?.toString() || '0');
      setDescription(product.description || '');
    } catch (err: any) {
      console.error('Error loading product:', err);
      Alert.alert('Erro', 'Não foi possível carregar os dados do produto', [
        { text: 'Voltar', onPress: () => navigation.goBack() }
      ]);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const handlePriceChange = (value: string) => {
    const formatted = formatCurrencyInput(value);
    setPrice(formatted);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await productService.update(productId, {
        brand,
        volume: parseInt(volume),
        price: parseCurrencyInput(price),
        stockQuantity: parseInt(stockQuantity),
        description: description || undefined,
      });
      
      Alert.alert('Sucesso', 'Produto atualizado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao atualizar produto';
      Alert.alert('Erro', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProduct) {
    return <Loading fullScreen message="Carregando produto..." />;
  }

  return (
    <Container safe padding>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Button
            variant="ghost"
            size="sm"
            onPress={() => navigation.goBack()}
          >
            ← Voltar
          </Button>
          <Spacing size="md" />
          <Text variant="h1" weight="bold">
            Editar Produto
          </Text>
          <Text variant="body" color="secondary">
            Atualize os dados do produto
          </Text>
        </View>

        <Spacing size="lg" />

        <Card variant="elevated" padding="lg">
          <Input
            label="Marca da Cerveja"
            placeholder="Ex: Heineken, Brahma, Budweiser..."
            value={brand}
            onChangeText={setBrand}
            autoCapitalize="words"
          />

          <Spacing size="md" />

          <Text variant="body" weight="semibold" style={styles.label}>
            Volume
          </Text>
          <Spacing size="xs" />
          <View style={styles.volumeGrid}>
            {VOLUME_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={volume === option.value.toString() ? 'primary' : 'outline'}
                size="sm"
                onPress={() => setVolume(option.value.toString())}
                style={styles.volumeButton}
              >
                <Text
                  variant="caption"
                  weight="semibold"
                  style={{ color: volume === option.value.toString() ? theme.colors.white : theme.colors.primary.main }}
                >
                  {option.label}
                </Text>
              </Button>
            ))}
          </View>

          <Spacing size="md" />

          <Input
            label="Preço (R$)"
            placeholder="0,00"
            value={price}
            onChangeText={handlePriceChange}
            keyboardType="numeric"
          />

          <Spacing size="md" />

          <Input
            label="Quantidade em Estoque"
            placeholder="0"
            value={stockQuantity}
            onChangeText={setStockQuantity}
            keyboardType="number-pad"
          />

          <Spacing size="md" />

          <Input
            label="Descrição (opcional)"
            placeholder="Informações adicionais sobre o produto..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
        </Card>

        <Spacing size="xl" />

        <Button
          variant="primary"
          size="lg"
          onPress={handleSubmit}
          loading={isLoading}
        >
          Atualizar Produto
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
  volumeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  volumeButton: {
    flex: 0,
    minWidth: '30%',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
