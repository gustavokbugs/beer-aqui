import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { ALLOWED_VOLUMES } from '@/domain/entities/product.entity';
import { NotFoundError, ValidationError, UnauthorizedError } from '@/domain/errors/domain-errors';
import { ProductResponseDTO } from '@/application/dtos/product.dto';

export interface UpdateProductDTO {
  productId: string;
  userId: string; // Para verificar autorização
  name?: string;
  brand?: string;
  volumeMl?: number;
  price?: number;
  stock?: number;
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
    if (dto.name !== undefined) {
      if (dto.name.trim().length === 0) {
        throw new ValidationError('Product name cannot be empty');
      }
      product.name = dto.name.trim();
    }

    if (dto.brand !== undefined) {
      if (dto.brand.trim().length === 0) {
        throw new ValidationError('Brand cannot be empty');
      }
      product.brand = dto.brand.trim();
    }

    if (dto.volumeMl !== undefined) {
      if (!ALLOWED_VOLUMES.includes(dto.volumeMl)) {
        throw new ValidationError(
          `Invalid volume. Allowed volumes are: ${ALLOWED_VOLUMES.join(', ')} ml`
        );
      }
      product.volumeMl = dto.volumeMl;
    }

    if (dto.price !== undefined) {
      if (dto.price < 0) {
        throw new ValidationError('Price cannot be negative');
      }
      product.updatePrice(dto.price);
    }

    if (dto.stock !== undefined) {
      if (dto.stock < 0) {
        throw new ValidationError('Stock cannot be negative');
      }
      // Calcular diferença e ajustar estoque
      const difference = dto.stock - product.stock;
      if (difference > 0) {
        product.increaseStock(difference);
      } else if (difference < 0) {
        product.decreaseStock(Math.abs(difference));
      }
    }

    if (dto.description !== undefined) {
      product.description = dto.description || null;
    }

    if (dto.imageUrl !== undefined) {
      product.imageUrl = dto.imageUrl || null;
    }

    // Salvar alterações
    const updatedProduct = await this.productRepository.update(product);

    // Mapear para DTO de resposta
    return {
      id: updatedProduct.id,
      vendorId: updatedProduct.vendorId,
      name: updatedProduct.name,
      brand: updatedProduct.brand,
      volumeMl: updatedProduct.volumeMl,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      description: updatedProduct.description,
      imageUrl: updatedProduct.imageUrl,
      isActive: updatedProduct.isActive,
      pricePerLiter: updatedProduct.getPricePerLiter(),
      volumeInLiters: updatedProduct.volumeMl / 1000,
      createdAt: updatedProduct.createdAt,
    };
  }
}
