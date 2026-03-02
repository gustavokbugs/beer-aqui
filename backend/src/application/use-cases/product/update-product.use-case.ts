import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { ALLOWED_VOLUMES } from '@/domain/entities/product.entity';
import { NotFoundError, ValidationError, UnauthorizedError } from '@/domain/errors/domain-errors';
import { ProductResponseDTO } from '@/application/dtos/product.dto';

export interface UpdateProductDTO {
  productId: string;
  userId: string; // Para verificar autorização
  brand?: string;
  volume?: number;
  price?: number;
  stockQuantity?: number;
  description?: string;
  imageUrl?: string;
}

export class UpdateProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly vendorRepository: IVendorRepository
  ) {}

  async execute(dto: UpdateProductDTO): Promise<ProductResponseDTO> {
    // Buscar produto
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Buscar vendedor para verificar autorização
    const vendor = await this.vendorRepository.findById(product.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Verificar autorização (apenas o vendedor dono do produto pode atualizar)
    if (vendor.userId !== dto.userId) {
      throw new UnauthorizedError('You are not authorized to update this product');
    }

    // Atualizar campos
    if (dto.brand !== undefined) {
      if (dto.brand.trim().length === 0) {
        throw new ValidationError('Brand cannot be empty');
      }
      product.updateBrand(dto.brand);
    }

    if (dto.volume !== undefined) {
      if (!ALLOWED_VOLUMES.includes(dto.volume)) {
        throw new ValidationError(
          `Invalid volume. Allowed volumes are: ${ALLOWED_VOLUMES.join(', ')} ml`
        );
      }
      product.props.volume = dto.volume;
    }

    if (dto.price !== undefined) {
      if (dto.price < 0) {
        throw new ValidationError('Price cannot be negative');
      }
      product.updatePrice(dto.price);
    }

    if (dto.stockQuantity !== undefined) {
      if (dto.stockQuantity < 0) {
        throw new ValidationError('Stock cannot be negative');
      }
      product.updateStock(dto.stockQuantity);
    }

    if (dto.description !== undefined) {
      product.updateDescription(dto.description || '');
    }

    if (dto.imageUrl !== undefined) {
      product.updateImage(dto.imageUrl || '');
    }

    // Salvar alterações
    const updatedProduct = await this.productRepository.update(product);

    // Mapear para DTO de resposta
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
      volumeInLiters: updatedProduct.volume / 1000,
      createdAt: updatedProduct.createdAt,
      updatedAt: updatedProduct.updatedAt,
    };
  }
}
