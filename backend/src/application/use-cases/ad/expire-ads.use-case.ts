import { IAdRepository } from '@/domain/repositories/ad.repository';
import { AdStatus } from '@/domain/entities/ad.entity';

export interface ExpireAdsResponseDTO {
  expiredCount: number;
  message: string;
}

/**
 * Use Case para expirar anúncios automaticamente
 * Este use case deve ser executado por um job agendado (cron job)
 * Recomendação: executar a cada hora ou a cada 6 horas
 */
export class ExpireAdsUseCase {
  constructor(private readonly adRepository: IAdRepository) {}

  async execute(): Promise<ExpireAdsResponseDTO> {
    const now = new Date();
    
    // Buscar anúncios ativos que já passaram da data de término
    const activeAds = await this.adRepository.findByStatus(AdStatus.ACTIVE);

    let expiredCount = 0;

    // Processar cada anúncio ativo
    for (const ad of activeAds) {
      // Verificar se o anúncio já expirou
      if (ad.endDate < now) {
        // Expirar o anúncio
        ad.expire();

        // Salvar alterações
        await this.adRepository.update(ad);
        
        expiredCount++;

        // TODO: Notificar vendedor sobre expiração do anúncio
        // await notificationService.notifyAdExpired(ad.id);
      }
    }

    return {
      expiredCount,
      message: `Successfully expired ${expiredCount} ad(s)`,
    };
  }
}
