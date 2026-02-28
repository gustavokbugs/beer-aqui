import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Container,
  Text,
  Card,
  Spacing,
  Loading,
  ErrorMessage,
  Button,
} from '@/components';
import { theme } from '@/theme';
import { formatPrice, formatVolume } from '@/utils';
import { Product } from '@/types';
import { productService } from '@/services/product.service';
import { useAuthStore } from '@/store/auth.store';
import { VendorStackParamList } from '@/navigation/types';

type NavigationProp = StackNavigationProp<VendorStackParamList, 'ManageProducts'>;

export const ManageProductsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Só carrega produtos quando a autenticação estiver pronta
    if (!authLoading && isAuthenticated) {
      loadProducts();
    }
  }, [authLoading, isAuthenticated]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await productService.getMyProducts(true);
      setProducts(data.products);
    } catch (err: any) {
      console.error('Error loading products:', err);
      setError(err.message || 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = () => {
    navigation.navigate('AddProduct');
  };

  const handleEditProduct = (product: Product) => {
    navigation.navigate('EditProduct', { productId: product.id });
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      await productService.toggleStatus(product.id);
      Alert.alert('Sucesso', `Produto ${product.isActive ? 'desativado' : 'ativado'}`);
      loadProducts();
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao atualizar produto');
    }
  };

  const renderProduct = ({ item }: { item: Product }) => {
    const volumeMl = item.volume || item.volumeMl || 0;
    
    return (
      <Card variant="elevated" padding="md" style={styles.productCard}>
        <TouchableOpacity
          onPress={() => handleEditProduct(item)}
          style={styles.productContent}
        >
          <View style={styles.productHeader}>
            <View style={styles.productInfo}>
              <Text variant="h3" weight="semibold">
                {item.brand}
              </Text>
              <Text variant="body" color="secondary">
                {formatVolume(volumeMl)}
              </Text>
            </View>
            
            <View style={styles.productPrice}>
              <Text variant="h3" weight="bold" color="primary">
                {formatPrice(item.price)}
              </Text>
              <Text variant="caption" color="secondary">
                {item.stockQuantity || 0} em estoque
              </Text>
            </View>
          </View>

          <Spacing size="sm" />

          <View style={styles.productActions}>
            <TouchableOpacity
              onPress={() => handleToggleStatus(item)}
              style={styles.statusButton}
            >
              <Ionicons
                name={item.isActive ? 'checkmark-circle' : 'close-circle'}
                size={20}
                color={item.isActive ? theme.colors.success.main : theme.colors.error.main}
              />
              <Text
                variant="caption"
                color={item.isActive ? 'success' : 'error'}
                style={styles.statusText}
              >
                {item.isActive ? 'Ativo' : 'Inativo'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleEditProduct(item)}
              style={styles.editButton}
            >
              <Ionicons name="create-outline" size={20} color={theme.colors.primary.main} />
              <Text variant="caption" color="primary" style={styles.editText}>
                Editar
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Card>
    );
  };

  if (isLoading) {
    return <Loading fullScreen message="Carregando produtos..." />;
  }

  return (
    <Container safe padding>
      <View style={styles.header}>
        <Text variant="h1" weight="bold">
          Meus Produtos
        </Text>
        <Text variant="body" color="secondary">
          Gerencie seus produtos
        </Text>
      </View>

      <Spacing size="lg" />

      {error ? (
        <ErrorMessage
          message={error}
          onRetry={loadProducts}
          retryLabel="Tentar novamente"
        />
      ) : products.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="beer-outline" size={64} color={theme.colors.gray[300]} />
          <Spacing size="md" />
          <Text variant="h3" color="secondary" style={styles.emptyText}>
            Nenhum produto cadastrado
          </Text>
          <Spacing size="sm" />
          <Text variant="body" color="secondary" style={styles.emptyText}>
            Adicione seu primeiro produto para começar a vender
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <Spacing size="md" />}
        />
      )}

      <View style={styles.fab}>
        <Button
          variant="primary"
          size="lg"
          onPress={handleAddProduct}
          style={styles.fabButton}
        >
          <Ionicons name="add" size={24} color={theme.colors.white} />
          <Text variant="body" weight="semibold" style={styles.fabText}>
            Adicionar Produto
          </Text>
        </Button>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: theme.spacing.md,
  },
  list: {
    paddingBottom: 80,
  },
  productCard: {
    marginBottom: 0,
  },
  productContent: {
    width: '100%',
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  productInfo: {
    flex: 1,
  },
  productPrice: {
    alignItems: 'flex-end',
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: theme.spacing.lg,
  },
  statusButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  statusText: {
    marginLeft: theme.spacing.xs,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  editText: {
    marginLeft: theme.spacing.xs,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  fabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  fabText: {
    color: theme.colors.white,
  },
});
