import { IAdRepository } from '@/domain/repositories/ad.repository';
import { Ad, AdStatus, PaymentStatus } from '@/domain/entities/ad.entity';
import { PrismaService } from '../database/prisma.service';

export class PrismaAdRepository implements IAdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Ad | null> {
    const ad = await this.prisma.ad.findUnique({ where: { id } });
    if (!ad) return null;
    return this.toDomain(ad);
  }

  async save(ad: Ad): Promise<Ad> {
    const created = await this.prisma.ad.create({
      data: {
        id: ad.id,
        productId: ad.productId,
        startDate: ad.startDate,
        endDate: ad.endDate,
        priority: ad.priority,
        status: ad.status,
        paymentStatus: ad.paymentStatus,
        createdAt: ad.createdAt,
        updatedAt: ad.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async update(ad: Ad): Promise<Ad> {
    const updated = await this.prisma.ad.update({
      where: { id: ad.id },
      data: {
        startDate: ad.startDate,
        endDate: ad.endDate,
        priority: ad.priority,
        status: ad.status,
        paymentStatus: ad.paymentStatus,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ad.delete({ where: { id } });
  }

  async findByProductId(productId: string): Promise<Ad[]> {
    const ads = await this.prisma.ad.findMany({
      where: { productId },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    });

    return ads.map((ad) => this.toDomain(ad));
  }

  async findActive(page: number, limit: number): Promise<{ ads: Ad[]; total: number }> {
    const skip = (page - 1) * limit;
    const now = new Date();

    const where = {
      status: AdStatus.ACTIVE,
      startDate: { lte: now },
      endDate: { gte: now },
    };

    const [ads, total] = await Promise.all([
      this.prisma.ad.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.ad.count({ where }),
    ]);

    return {
      ads: ads.map((ad) => this.toDomain(ad)),
      total,
    };
  }

  async findByStatus(
    status: AdStatus,
    page: number,
    limit: number
  ): Promise<{ ads: Ad[]; total: number }> {
    const skip = (page - 1) * limit;

    const [ads, total] = await Promise.all([
      this.prisma.ad.findMany({
        where: { status },
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.ad.count({ where: { status } }),
    ]);

    return {
      ads: ads.map((ad) => this.toDomain(ad)),
      total,
    };
  }

  async findExpiredActive(): Promise<Ad[]> {
    const now = new Date();
    const ads = await this.prisma.ad.findMany({
      where: {
        status: AdStatus.ACTIVE,
        endDate: { lt: now },
      },
      orderBy: { endDate: 'asc' },
    });

    return ads.map((ad) => this.toDomain(ad));
  }

  async findByVendorId(
    vendorId: string,
    page: number,
    limit: number
  ): Promise<{ ads: Ad[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = {
      product: {
        vendorId,
      },
    };

    const [ads, total] = await Promise.all([
      this.prisma.ad.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.ad.count({ where }),
    ]);

    return {
      ads: ads.map((ad) => this.toDomain(ad)),
      total,
    };
  }

  private toDomain(raw: any): Ad {
    return Ad.reconstitute({
      id: raw.id,
      productId: raw.productId,
      startDate: raw.startDate,
      endDate: raw.endDate,
      priority: raw.priority,
      status: raw.status as AdStatus,
      paymentStatus: raw.paymentStatus as PaymentStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
