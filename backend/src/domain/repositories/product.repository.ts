import { Product } from '../entities/product.entity';

export interface SearchProductsQuery {
  vendorId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  volume?: number;
  isActive?: boolean;
  limit?: number;
  offset?: number;
  // Filtros de localização
  state?: string;
  city?: string;
  neighborhood?: string;
}

export interface IProductRepository {
  /**
   * Encontra um produto por ID
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Salva um novo produto
   */
  save(product: Product): Promise<Product>;

  /**
   * Atualiza um produto existente
   */
  update(product: Product): Promise<Product>;

  /**
   * Remove um produto
   */
  delete(id: string): Promise<void>;

  /**
   * Lista produtos de um vendedor
   */
  findByVendorId(vendorId: string, page: number, limit: number): Promise<{
    products: Product[];
    total: number;
  }>;

  /**
   * Busca produtos com filtros
   */
  search(query: SearchProductsQuery, page: number, limit: number): Promise<{ 
    products: Array<{ product: Product; vendor: any }>; 
    total: number;
  }>;

  /**
   * Busca produtos por marca
   */
  findByBrand(brand: string, page: number, limit: number): Promise<{
    products: Product[];
    total: number;
  }>;

  /**
   * Lista todos os produtos ativos
   */
  findAllActive(page: number, limit: number): Promise<{ products: Product[]; total: number }>;  /**
   * Busca sugestões de marcas para autocomplete
   */
  searchBrandSuggestions(query: string, limit: number): Promise<string[]>;
}
