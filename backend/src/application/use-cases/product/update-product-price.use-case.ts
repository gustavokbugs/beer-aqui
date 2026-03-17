import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { NotFoundError, ValidationError, UnauthorizedError } from '@/domain/errors/domain-errors';
import { ProductResponseDTO } from '@/application/dtos/product.dto';

export interface UpdateProductPriceDTO {
  productId: string;
  userId: string;
  newPrice: number;
}

export class UpdateProductPriceUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly vendorRepository: IVendorRepository
  ) {}

  async execute(dto: UpdateProductPriceDTO): Promise<ProductResponseDTO> {
    if (dto.newPrice < 0) {
      throw new ValidationError('Price cannot be negative');
    }

    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const vendor = await this.vendorRepository.findById(product.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    if (vendor.userId !== dto.userId) {
      throw new UnauthorizedError('You are not authorized to update this product');
    }

    product.updatePrice(dto.newPrice);

    const updatedProduct = await this.productRepository.update(product);

    return {
      id: updatedProduct.id,
      vendorId: updatedProduct.vendorId,
      brand: updatedProduct.brand,
      volume: updatedProduct.volume,
      price: updatedProduct.price,
      stockQuantity: updatedProduct.stockQuantity,
      description: updatedProduct.description,
      imageUrl: updatedProduct.imageUrl,
      isActive: updatedProduct.isActive,
      pricePerLiter: updatedProduct.getPricePerLiter(),
      volumeInLiters: updatedProduct.getVolumeInLiters(),
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    };
  }
}
