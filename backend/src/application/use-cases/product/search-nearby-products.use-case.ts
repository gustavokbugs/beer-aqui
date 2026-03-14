import { IProductRepository } from '@/domain/repositories/product.repository';
import { SearchNearbyProductsDTO, ProductResponseDTO } from '@/application/dtos/product.dto';

export class SearchNearbyProductsUseCase {
  constructor(private productRepository: IProductRepository) {}

  async execute(dto: SearchNearbyProductsDTO): Promise<{
    products: ProductResponseDTO[];
    total: number;
    page: number;
    limit: number;
  }> {
    if (dto.radiusInMeters !== undefined && dto.radiusInMeters <= 0) {
      throw new Error('Radius must be positive');
    }

    const page = dto.page || 1;
    const limit = Math.min(dto.limit || 20, 100);
    const radiusInMeters = dto.radiusInMeters ?? 5000;

    const { products, total } = await this.productRepository.findNearby(
      {
        latitude: dto.latitude,
        longitude: dto.longitude,
        radiusInMeters,
        brand: dto.brand,
        minPrice: dto.minPrice,
        maxPrice: dto.maxPrice,
        volume: dto.volume,
        isActive: true,
      },
      page,
      limit
    );

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
      vendor: vendor
        ? {
            id: vendor.id,
            companyName: vendor.companyName,
            type: vendor.type,
            city: vendor.addressCity,
            state: vendor.addressState,
            neighborhood: vendor.addressStreet,
            latitude: vendor.latitude,
            longitude: vendor.longitude,
            distanceInMeters: vendor.distanceInMeters,
          }
        : undefined,
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
