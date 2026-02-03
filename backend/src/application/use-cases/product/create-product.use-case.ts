import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { Product } from '@/domain/entities/product.entity';
import { CreateProductDTO, ProductResponseDTO } from '../dtos/product.dto';

export class CreateProductUseCase {
  constructor(
    private productRepository: IProductRepository,
    private vendorRepository: IVendorRepository
  ) {}

  async execute(dto: CreateProductDTO): Promise<ProductResponseDTO> {
    // Verificar se vendor existe
    const vendor = await this.vendorRepository.findById(dto.vendorId);
    if (!vendor) {
      throw new Error('Vendor not found');
    }

    // Verificar se vendor está verificado
    vendor.ensureIsVerified();

    // Validar dados
    if (dto.brand.trim().length < 2) {
      throw new Error('Brand name must be at least 2 characters long');
    }

    if (dto.price <= 0) {
      throw new Error('Price must be positive');
    }

    if (dto.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }

    // Criar produto
    const product = Product.create({
      vendorId: dto.vendorId,
      brand: dto.brand.trim(),
      volume: dto.volume,
      price: dto.price,
      isActive: true,
      stockQuantity: dto.stockQuantity,
      description: dto.description,
      imageUrl: dto.imageUrl,
    });

    // Salvar no banco
    const savedProduct = await this.productRepository.save(product);

    return {
      id: savedProduct.id,
      vendorId: savedProduct.vendorId,
      brand: savedProduct.brand,
      volume: savedProduct.volume,
      volumeInLiters: savedProduct.getVolumeInLiters(),
      price: savedProduct.price,
      pricePerLiter: savedProduct.getPricePerLiter(),
      isActive: savedProduct.isActive,
      stockQuantity: savedProduct.stockQuantity,
      description: savedProduct.description,
      imageUrl: savedProduct.imageUrl,
      createdAt: savedProduct.createdAt,
      updatedAt: savedProduct.updatedAt,
    };
  }
}
