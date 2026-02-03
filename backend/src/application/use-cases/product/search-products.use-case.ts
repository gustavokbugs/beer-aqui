import { IProductRepository } from '@/domain/repositories/product.repository';
import { SearchProductsDTO, ProductResponseDTO } from '../dtos/product.dto';

export class SearchProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(dto: SearchProductsDTO): Promise<{
    products: ProductResponseDTO[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Validar filtros
    if (dto.minPrice && dto.minPrice < 0) {
      throw new Error('Min price cannot be negative');
    }

    if (dto.maxPrice && dto.maxPrice < 0) {
      throw new Error('Max price cannot be negative');
    }

    if (dto.minPrice && dto.maxPrice && dto.minPrice > dto.maxPrice) {
      throw new Error('Min price cannot be greater than max price');
    }

    const page = dto.page || 1;
    const limit = dto.limit || 20;

    // Buscar produtos
    const { products, total } = await this.productRepository.search({
      vendorId: dto.vendorId,
      brand: dto.brand,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      volume: dto.volume,
      isActive: true, // Apenas produtos ativos
      limit,
      offset: (page - 1) * limit,
    });

    // Mapear para DTO
    const productDTOs = products.map((product) => ({
      id: product.id,
      vendorId: product.vendorId,
      brand: product.brand,
      volume: product.volume,
      volumeInLiters: product.getVolumeInLiters(),
      price: product.price,
      pricePerLiter: product.getPricePerLiter(),
      isActive: product.isActive,
      stockQuantity: product.stockQuantity,
      description: product.description,
      imageUrl: product.imageUrl,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    return {
      products: productDTOs,
      total,
      page,
      limit,
    };
  }
}
