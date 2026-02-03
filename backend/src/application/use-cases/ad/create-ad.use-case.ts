import { IAdRepository } from '@/domain/repositories/ad.repository';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { Ad, AdStatus, PaymentStatus } from '@/domain/entities/ad.entity';
import { CreateAdDTO, AdResponseDTO } from '../dtos/ad.dto';

export class CreateAdUseCase {
  constructor(
    private adRepository: IAdRepository,
    private productRepository: IProductRepository
  ) {}

  async execute(dto: CreateAdDTO): Promise<AdResponseDTO> {
    // Verificar se produto existe
    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Verificar se produto está ativo
    product.ensureIsActive();

    // Validar datas
    const now = new Date();
    if (dto.startDate < now) {
      throw new Error('Start date cannot be in the past');
    }

    if (dto.endDate <= dto.startDate) {
      throw new Error('End date must be after start date');
    }

    // Validar prioridade
    if (dto.priority < 1 || dto.priority > 10) {
      throw new Error('Priority must be between 1 and 10');
    }

    // Criar anúncio
    const ad = Ad.create({
      productId: dto.productId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      priority: dto.priority,
      status: AdStatus.ACTIVE,
      paymentStatus: PaymentStatus.PENDING,
    });

    // Salvar no banco
    const savedAd = await this.adRepository.save(ad);

    return {
      id: savedAd.id,
      productId: savedAd.productId,
      startDate: savedAd.startDate,
      endDate: savedAd.endDate,
      priority: savedAd.priority,
      status: savedAd.status,
      paymentStatus: savedAd.paymentStatus,
      durationInDays: savedAd.getDurationInDays(),
      remainingDays: savedAd.getRemainingDays(),
      createdAt: savedAd.createdAt,
      updatedAt: savedAd.updatedAt,
    };
  }
}
