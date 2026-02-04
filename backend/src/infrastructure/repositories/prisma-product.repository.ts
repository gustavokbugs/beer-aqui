import { IProductRepository, SearchProductsQuery as SearchProductFilters } from '@/domain/repositories/product.repository';
import { Product } from '@/domain/entities/product.entity';
import { PrismaService } from '../database/prisma.service';

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) return null;

    return this.toDomain(product);
  }

  async findByVendorId(
    vendorId: string,
    page: number,
    limit: number
  ): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { vendorId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({
        where: { vendorId },
      }),
    ]);

    return {
      products: products.map((p) => this.toDomain(p)),
      total,
    };
  }

  async search(
    filters: SearchProductFilters,
    page: number,
    limit: number
  ): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.vendorId) {
      where.vendorId = filters.vendorId;
    }

    // Busca fuzzy: aceita busca parcial ("hein" encontra "Heineken")
    if (filters.brand) {
      where.brand = {
        contains: filters.brand,
        mode: 'insensitive',
      };
    }

    if (filters.volume) {
      where.volume = filters.volume;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    if (filters.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    // Filtros de localização via vendor
    if (filters.state || filters.city || filters.neighborhood) {
      where.vendor = {};
      if (filters.state) {
        where.vendor.addressState = {
          contains: filters.state,
          mode: 'insensitive',
        };
      }
      if (filters.city) {
        where.vendor.addressCity = {
          contains: filters.city,
          mode: 'insensitive',
        };
      }
      if (filters.neighborhood) {
        where.vendor.addressStreet = {
          contains: filters.neighborhood,
          mode: 'insensitive',
        };
      }
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          vendor: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => ({ product: this.toDomain(p), vendor: p.vendor })),
      total,
    };
  }

  async save(product: Product): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        id: product.id,
        vendorId: product.vendorId,
        brand: product.brand,
        volume: product.volume,
        price: product.price,
        stockQuantity: product.stockQuantity,
        description: product.description ?? null,
        imageUrl: product.imageUrl ?? null,
        isActive: product.isActive,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async update(product: Product): Promise<Product> {
    const updated = await this.prisma.product.update({
      where: { id: product.id },
      data: {
        brand: product.brand,
        volume: product.volume,
        price: product.price,
        stockQuantity: product.stockQuantity,
        description: product.description ?? null,
        imageUrl: product.imageUrl ?? null,
        isActive: product.isActive,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  async searchBrandSuggestions(query: string, limit: number = 10): Promise<string[]> {
    const products = await this.prisma.product.findMany({
      where: {
        brand: {
          contains: query,
          mode: 'insensitive',
        },
        isActive: true,
      },
      select: {
        brand: true,
      },
      distinct: ['brand'],
      take: limit,
      orderBy: {
        brand: 'asc',
      },
    });

    return products.map(p => p.brand);
  }

  async findByBrand(brand: string, page: number, limit: number): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: {
          brand: {
            contains: brand,
            mode: 'insensitive',
          },
          isActive: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({
        where: {
          brand: {
            contains: brand,
            mode: 'insensitive',
          },
          isActive: true,
        },
      }),
    ]);

    return {
      products: products.map(p => this.toDomain(p)),
      total,
    };
  }

  async findAllActive(page: number, limit: number): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({
        where: { isActive: true },
      }),
    ]);

    return {
      products: products.map(p => this.toDomain(p)),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  private toDomain(raw: any): Product {
    return Product.reconstitute({
      id: raw.id,
      vendorId: raw.vendorId,
      brand: raw.brand,
      volume: raw.volume,
      price: raw.price,
      stockQuantity: raw.stockQuantity,
      description: raw.description ?? undefined,
      imageUrl: raw.imageUrl ?? undefined,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
