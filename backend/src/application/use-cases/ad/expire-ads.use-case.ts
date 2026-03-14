import { IAdRepository } from '@/domain/repositories/ad.repository';

export interface ExpireAdsResponseDTO {
  expiredCount: number;
  message: string;
}

export class ExpireAdsUseCase {
  constructor(private readonly adRepository: IAdRepository) {}

  async execute(): Promise<ExpireAdsResponseDTO> {
    const activeAds = await this.adRepository.findExpiredActive();

    let expiredCount = 0;

    for (const ad of activeAds) {
      ad.expire();
      await this.adRepository.update(ad);
      expiredCount++;
    }

    return {
      expiredCount,
      message: `Successfully expired ${expiredCount} ad(s)`,
    };
  }
}
