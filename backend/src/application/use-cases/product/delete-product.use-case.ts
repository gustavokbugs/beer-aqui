import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { NotFoundError, UnauthorizedError } from '@/domain/errors/domain-errors';

export interface DeleteProductDTO {
  productId: string;
  userId: string; // Para verificar autorização
}

export interface DeleteProductResponseDTO {
  success: boolean;
  message: string;
}

export class DeleteProductUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly vendorRepository: IVendorRepository
  ) {}

  async execute(dto: DeleteProductDTO): Promise<DeleteProductResponseDTO> {
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
      throw new UnauthorizedError('You are not authorized to delete this product');
    }

    // Soft delete - apenas desativar o produto
    product.isActive = false;

    // Salvar alterações
    await this.productRepository.update(product);

    // TODO: Em produção, considerar deletar anúncios ativos deste produto
    // ou adicionar deletedAt no modelo de produto para soft delete completo

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  }
}
