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
import { productService } from '@/services/product.service';
import { VendorStackParamList } from '@/navigation/types';

type NavigationProp = StackNavigationProp<VendorStackParamList, 'AddProduct'>;

const VOLUME_OPTIONS = [
  { label: '269ml (Lata)', value: 269 },
  { label: '350ml (Lata)', value: 350 },
  { label: '473ml (Lata)', value: 473 },
  { label: '330ml (Long Neck)', value: 330 },
  { label: '600ml (Garrafa)', value: 600 },
  { label: '1000ml (Litro)', value: 1000 },
];

export const AddProductScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [isLoading, setIsLoading] = useState(false);
  const [brand, setBrand] = useState('');
  const [volume, setVolume] = useState('350');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await productService.create({
        brand,
        volume: parseInt(volume),
        price: parseFloat(price),
        stockQuantity: parseInt(stockQuantity),
        description: description || undefined,
      });
      
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao cadastrar produto';
      
      if (errorMessage.includes('Vendor profile not found')) {
        Alert.alert(
          'Perfil Incompleto',
          'Você precisa completar seu perfil de vendedor antes de cadastrar produtos. Entre em contato com o suporte.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Erro', errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
            Adicionar Produto
          </Text>
          <Text variant="body" color="secondary">
            Preencha os dados do produto
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
            placeholder="0.00"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
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
          Cadastrar Produto
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
