import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { NotFoundError, UnauthorizedError } from '@/domain/errors/domain-errors';
import { ProductResponseDTO } from '@/application/dtos/product.dto';

export interface ToggleProductStatusDTO {
  productId: string;
  userId: string;
}

export class ToggleProductStatusUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly vendorRepository: IVendorRepository
  ) {}

  async execute(dto: ToggleProductStatusDTO): Promise<ProductResponseDTO> {
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

    if (product.isActive) {
      product.deactivate();
    } else {
      product.activate();
    }

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
