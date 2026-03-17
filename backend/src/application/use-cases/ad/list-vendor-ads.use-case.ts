import { AdResponseDTO } from '@/application/dtos/ad.dto';
import { IAdRepository } from '@/domain/repositories/ad.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';

interface ListVendorAdsDTO {
  userId: string;
  page?: number;
  limit?: number;
}

export class ListVendorAdsUseCase {
  constructor(
    private readonly adRepository: IAdRepository,
    private readonly vendorRepository: IVendorRepository
  ) {}

  async execute(dto: ListVendorAdsDTO): Promise<{
    ads: AdResponseDTO[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 20;

    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    const vendor = await this.vendorRepository.findByUserId(dto.userId);

    if (!vendor) {
      throw new Error('Vendor not found');
    }

    const { ads, total } = await this.adRepository.findByVendorId(vendor.id, page, limit);

    return {
      ads: ads.map((ad) => ({
        id: ad.id,
        productId: ad.productId,
        startDate: ad.startDate,
        endDate: ad.endDate,
        priority: ad.priority,
        status: ad.status,
        paymentStatus: ad.paymentStatus,
        durationInDays: ad.getDurationInDays(),
        remainingDays: ad.getRemainingDays(),
        createdAt: ad.createdAt,
        updatedAt: ad.updatedAt,
      })),
      total,
      page,
      limit,
    };
  }
}