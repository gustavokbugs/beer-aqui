import { IProductRepository, SearchProductFilters } from '@/domain/repositories/product.repository';
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

    if (filters.brand) {
      where.brand = {
        contains: filters.brand,
        mode: 'insensitive',
      };
    }

    if (filters.volumeMl) {
      where.volumeMl = filters.volumeMl;
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

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      products: products.map((p) => this.toDomain(p)),
      total,
    };
  }

  async save(product: Product): Promise<Product> {
    const created = await this.prisma.product.create({
      data: {
        id: product.id,
        vendorId: product.vendorId,
        name: product.name,
        brand: product.brand,
        volumeMl: product.volumeMl,
        price: product.price,
        stock: product.stock,
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
        name: product.name,
        brand: product.brand,
        volumeMl: product.volumeMl,
        price: product.price,
        stock: product.stock,
        description: product.description ?? null,
        imageUrl: product.imageUrl ?? null,
        isActive: product.isActive,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  private toDomain(raw: any): Product {
    return Product.reconstitute({
      id: raw.id,
      vendorId: raw.vendorId,
      brand: raw.brand,
      volume: raw.volumeMl,
      price: raw.price,
      stockQuantity: raw.stock,
      description: raw.description ?? undefined,
      imageUrl: raw.imageUrl ?? undefined,
      isActive: raw.isActive,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
