import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { NotFoundError } from '@/domain/errors/domain-errors';
import { ProductResponseDTO } from '@/application/dtos/product.dto';
import { VendorResponseDTO } from '@/application/dtos/vendor.dto';

export interface GetProductDetailsDTO {
  productId: string;
}

export interface ProductDetailsResponseDTO {
  product: ProductResponseDTO;
  vendor: VendorResponseDTO;
}

export class GetProductDetailsUseCase {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly vendorRepository: IVendorRepository
  ) {}

  async execute(dto: GetProductDetailsDTO): Promise<ProductDetailsResponseDTO> {
    // Buscar produto
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    // Buscar vendedor
    const vendor = await this.vendorRepository.findById(product.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Mapear para DTOs
    const productDTO: ProductResponseDTO = {
      id: product.id,
      vendorId: product.vendorId,
      name: product.name,
      brand: product.brand,
      volumeMl: product.volumeMl,
      price: product.price,
      stock: product.stock,
      description: product.description,
      imageUrl: product.imageUrl,
      isActive: product.isActive,
      pricePerLiter: product.getPricePerLiter(),
      volumeInLiters: product.volumeMl / 1000,
      createdAt: product.createdAt,
    };

    const vendorDTO: VendorResponseDTO = {
      id: vendor.id,
      userId: vendor.userId,
      companyName: vendor.companyName,
      cnpj: vendor.cnpj.getValue(),
      type: vendor.type,
      phone: vendor.phone,
      address: vendor.address,
      latitude: vendor.location.latitude,
      longitude: vendor.location.longitude,
      isVerified: vendor.isVerified,
      createdAt: vendor.createdAt,
    };

    return {
      product: productDTO,
      vendor: vendorDTO,
    };
  }
}
