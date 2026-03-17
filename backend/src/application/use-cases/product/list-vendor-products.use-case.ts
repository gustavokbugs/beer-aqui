import { IProductRepository } from '@/domain/repositories/product.repository';
import { ProductResponseDTO } from '@/application/dtos/product.dto';

export interface ListVendorProductsDTO {
  vendorId: string;
  includeInactive?: boolean;
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
    const page = dto.page || 1;
    const limit = Math.min(dto.limit || 20, 100);
    const includeInactive = dto.includeInactive || false;

    const { products, total } = await this.productRepository.findByVendorId(
      dto.vendorId,
      page,
      limit
    );

    const filteredProducts = includeInactive
      ? products
      : products.filter((p) => p.isActive);

    const productDTOs: ProductResponseDTO[] = filteredProducts.map((product) => ({
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
      volumeInLiters: product.getVolumeInLiters(),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
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
