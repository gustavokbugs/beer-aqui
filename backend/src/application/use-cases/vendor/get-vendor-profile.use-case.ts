import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { NotFoundError } from '@/domain/errors/domain-errors';
import { VendorResponseDTO } from '@/application/dtos/vendor.dto';

export interface GetVendorProfileDTO {
  vendorId: string;
}

export class GetVendorProfileUseCase {
  constructor(private readonly vendorRepository: IVendorRepository) {}

  async execute(dto: GetVendorProfileDTO): Promise<VendorResponseDTO> {
    // Buscar vendedor
    const vendor = await this.vendorRepository.findById(dto.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Mapear para DTO de resposta
    return {
      id: vendor.id,
      userId: vendor.userId,
      companyName: vendor.companyName,
      cnpj: vendor.cnpj.getValue(),
      type: vendor.type,
      phone: vendor.phone,
      address: vendor.address,
      latitude: vendor.location.latitude,
      longitude: vendor.location.longitude,
      isVerified: vendor.isVerified,
      createdAt: vendor.createdAt,
    };
  }
}
