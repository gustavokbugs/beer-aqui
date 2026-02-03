import { IAdRepository } from '@/domain/repositories/ad.repository';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { NotFoundError, UnauthorizedError, ValidationError } from '@/domain/errors/domain-errors';
import { AdStatus, PaymentStatus } from '@/domain/entities/ad.entity';

export interface CancelAdDTO {
  adId: string;
  userId: string; // Para verificar autorização
}

export interface CancelAdResponseDTO {
  success: boolean;
  message: string;
  refundEligible: boolean;
}

export class CancelAdUseCase {
  constructor(
    private readonly adRepository: IAdRepository,
    private readonly productRepository: IProductRepository,
    private readonly vendorRepository: IVendorRepository
  ) {}

  async execute(dto: CancelAdDTO): Promise<CancelAdResponseDTO> {
    // Buscar anúncio
    const ad = await this.adRepository.findById(dto.adId);
    if (!ad) {
      throw new NotFoundError('Ad not found');
    }

    // Buscar produto e vendedor para verificar autorização
    const product = await this.productRepository.findById(ad.productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const vendor = await this.vendorRepository.findById(product.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Verificar autorização
    if (vendor.userId !== dto.userId) {
      throw new UnauthorizedError('You are not authorized to cancel this ad');
    }

    // Verificar se já está cancelado ou expirado
    if (ad.status === AdStatus.CANCELED) {
      throw new ValidationError('Ad is already canceled');
    }

    if (ad.status === AdStatus.EXPIRED) {
      throw new ValidationError('Cannot cancel an expired ad');
    }

    // Cancelar anúncio
    ad.cancel();

    // Verificar elegibilidade para reembolso
    // Regra: reembolso se foi pago e ainda não começou
    const refundEligible =
      ad.paymentStatus === PaymentStatus.PAID && new Date() < ad.startDate;

    // Se elegível para reembolso, processar
    if (refundEligible) {
      ad.refund();
      // TODO: Integrar com gateway de pagamento para processar reembolso
    }

    // Salvar alterações
    await this.adRepository.update(ad);

    return {
      success: true,
      message: refundEligible
        ? 'Ad canceled successfully. Refund will be processed.'
        : 'Ad canceled successfully.',
      refundEligible,
    };
  }
}
