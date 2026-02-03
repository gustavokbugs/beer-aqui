import { IAdRepository } from '@/domain/repositories/ad.repository';
import { Ad, AdStatus, PaymentStatus } from '@/domain/entities/ad.entity';
import { PrismaService } from '../database/prisma.service';

export class PrismaAdRepository implements IAdRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Ad | null> {
    const ad = await this.prisma.ad.findUnique({
      where: { id },
    });

    if (!ad) return null;

    return this.toDomain(ad);
  }

  async findByStatus(status: AdStatus): Promise<Ad[]> {
    const ads = await this.prisma.ad.findMany({
      where: { status },
      orderBy: { priority: 'desc' },
    });

    return ads.map((ad) => this.toDomain(ad));
  }

  async findActiveByProduct(productId: string): Promise<Ad[]> {
    const ads = await this.prisma.ad.findMany({
      where: {
        productId,
        status: AdStatus.ACTIVE,
      },
      orderBy: { priority: 'desc' },
    });

    return ads.map((ad) => this.toDomain(ad));
  }

  async save(ad: Ad): Promise<Ad> {
    const created = await this.prisma.ad.create({
      data: {
        id: ad.id,
        productId: ad.productId,
        title: ad.title,
        description: ad.description,
        imageUrl: ad.imageUrl ?? null,
        startDate: ad.startDate,
        endDate: ad.endDate,
        priority: ad.priority,
        status: ad.status,
        paymentStatus: ad.paymentStatus,
        price: ad.price,
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
        title: ad.title,
        description: ad.description,
        imageUrl: ad.imageUrl ?? null,
        startDate: ad.startDate,
        endDate: ad.endDate,
        priority: ad.priority,
        status: ad.status,
        paymentStatus: ad.paymentStatus,
        price: ad.price,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  private toDomain(raw: any): Ad {
    return Ad.reconstitute({
      id: raw.id,
      productId: raw.productId,
      title: raw.title,
      description: raw.description,
      imageUrl: raw.imageUrl ?? undefined,
      startDate: raw.startDate,
      endDate: raw.endDate,
      priority: raw.priority,
      status: raw.status as AdStatus,
      paymentStatus: raw.paymentStatus as PaymentStatus,
      price: raw.price,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
