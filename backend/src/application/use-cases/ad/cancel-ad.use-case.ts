import { IAdRepository } from '@/domain/repositories/ad.repository';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { NotFoundError, UnauthorizedError, ValidationError } from '@/domain/errors/domain-errors';
import { AdStatus, PaymentStatus } from '@/domain/entities/ad.entity';

export interface CancelAdDTO {
  adId: string;
  userId: string;
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
    const ad = await this.adRepository.findById(dto.adId);
    if (!ad) {
      throw new NotFoundError('Ad not found');
    }

    const product = await this.productRepository.findById(ad.productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const vendor = await this.vendorRepository.findById(product.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    if (vendor.userId !== dto.userId) {
      throw new UnauthorizedError('You are not authorized to cancel this ad');
    }

    if (ad.status === AdStatus.CANCELLED) {
      throw new ValidationError('Ad is already canceled');
    }

    if (ad.status === AdStatus.EXPIRED) {
      throw new ValidationError('Cannot cancel an expired ad');
    }

    ad.cancel();

    const refundEligible =
      ad.paymentStatus === PaymentStatus.PAID && new Date() < ad.startDate;

    if (refundEligible) {
      ad.refund();
    }

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
