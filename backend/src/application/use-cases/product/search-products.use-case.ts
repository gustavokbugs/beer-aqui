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
    const page = dto.page || 1;
    const limit = Math.min(dto.limit || 20, 100);

    // Buscar produtos (validação feita no repository)
    const { products, total } = await this.productRepository.search(
      {
        vendorId: dto.vendorId,
        brand: dto.brand,
        minPrice: dto.minPrice,
        maxPrice: dto.maxPrice,
        volume: dto.volume,
        state: dto.state,
        city: dto.city,
        neighborhood: dto.neighborhood,
        isActive: true,
      },
      page,
      limit
    );

    // Mapear para DTO
    const productDTOs = products.map(({ product, vendor }) => ({
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
      vendor: vendor ? {
        id: vendor.id,
        companyName: vendor.companyName,
        type: vendor.type,
        city: vendor.addressCity,
        state: vendor.addressState,
        neighborhood: vendor.addressStreet,
        latitude: vendor.latitude,
        longitude: vendor.longitude,
      } : undefined,
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
