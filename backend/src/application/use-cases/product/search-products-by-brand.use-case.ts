import { IProductRepository } from '@/domain/repositories/product.repository';
import { ProductResponseDTO } from '@/application/dtos/product.dto';

export interface SearchProductsByBrandDTO {
  brand: string;
  vendorId?: string; // Filtro opcional por vendedor
  volumeMl?: number; // Filtro opcional por volume
  page?: number;
  limit?: number;
}

export interface SearchProductsByBrandResponseDTO {
  products: ProductResponseDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class SearchProductsByBrandUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: SearchProductsByBrandDTO): Promise<SearchProductsByBrandResponseDTO> {
    // Valores padrão
    const page = dto.page || 1;
    const limit = Math.min(dto.limit || 20, 100);

    // Buscar produtos com paginação
    const { products, total } = await this.productRepository.search(
      {
        brand: dto.brand,
        vendorId: dto.vendorId,
        volumeMl: dto.volumeMl,
        isActive: true, // Apenas produtos ativos
      },
      page,
      limit
    );

    // Mapear para DTOs
    const productDTOs: ProductResponseDTO[] = products.map((product) => ({
      id: product.id,
      vendorId: product.vendorId,
      brand: product.brand,
      volume: product.volume,
      price: product.price,
      stockQuantity: product.stockQuantity,
      description: product.description,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      pricePerLiter: product.getPricePerLiter(),
      volumeInLiters: product.volume / 1000,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return {
      products: productDTOs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
