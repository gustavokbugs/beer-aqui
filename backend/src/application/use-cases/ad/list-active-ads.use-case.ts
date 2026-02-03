import { IAdRepository } from '@/domain/repositories/ad.repository';
import { AdResponseDTO } from '../dtos/ad.dto';

export class ListActiveAdsUseCase {
  constructor(private adRepository: IAdRepository) {}

  async execute(
    page: number = 1,
    limit: number = 20
  ): Promise<{
    ads: AdResponseDTO[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Validar paginação
    if (page < 1) {
      throw new Error('Page must be greater than 0');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    // Buscar anúncios ativos
    const { ads, total } = await this.adRepository.findActive(page, limit);

    // Filtrar apenas anúncios realmente ativos no momento
    const activeNowAds = ads.filter((ad) => ad.isActiveNow());

    // Mapear para DTO
    const adDTOs = activeNowAds.map((ad) => ({
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
    }));

    return {
      ads: adDTOs,
      total,
      page,
      limit,
    };
  }
}
