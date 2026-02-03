import { IProductRepository } from '@/domain/repositories/product.repository';
import { ProductResponseDTO } from '@/application/dtos/product.dto';

export interface ListVendorProductsDTO {
  vendorId: string;
  includeInactive?: boolean; // Por padrão, só mostrar ativos
  page?: number;
  limit?: number;
}

export interface ListVendorProductsResponseDTO {
  products: ProductResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ListVendorProductsUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: ListVendorProductsDTO): Promise<ListVendorProductsResponseDTO> {
    // Valores padrão
    const page = dto.page || 1;
    const limit = Math.min(dto.limit || 20, 100);
    const includeInactive = dto.includeInactive || false;

    // Buscar produtos do vendedor com paginação
    const { products, total } = await this.productRepository.findByVendorId(
      dto.vendorId,
      page,
      limit
    );

    // Filtrar inativos se necessário
    const filteredProducts = includeInactive
      ? products
      : products.filter((p) => p.isActive);

    // Mapear para DTOs
    const productDTOs: ProductResponseDTO[] = filteredProducts.map((product) => ({
      id: product.id,
      vendorId: product.vendorId,
      name: product.name,
      brand: product.brand,
      volumeMl: product.volumeMl,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      pricePerLiter: product.getPricePerLiter(),
      volumeInLiters: product.volumeMl / 1000,
      createdAt: product.createdAt,
    }));

    return {
      products: productDTOs,
      total: includeInactive ? total : filteredProducts.length,
      page,
      limit,
      totalPages: Math.ceil((includeInactive ? total : filteredProducts.length) / limit),
    };
  }
}
