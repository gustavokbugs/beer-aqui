import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { NotFoundError, ValidationError, UnauthorizedError } from '@/domain/errors/domain-errors';
import { ProductResponseDTO } from '@/application/dtos/product.dto';

export interface UpdateProductPriceDTO {
  productId: string;
  userId: string; // Para verificar autorização
  newPrice: number;
}

export class UpdateProductPriceUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly vendorRepository: IVendorRepository
  ) {}

  async execute(dto: UpdateProductPriceDTO): Promise<ProductResponseDTO> {
    // Validar preço
    if (dto.newPrice < 0) {
      throw new ValidationError('Price cannot be negative');
    }

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

    // Verificar autorização
    if (vendor.userId !== dto.userId) {
      throw new UnauthorizedError('You are not authorized to update this product');
    }

    // Atualizar preço usando método de domínio
    product.updatePrice(dto.newPrice);

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
