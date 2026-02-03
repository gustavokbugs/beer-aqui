import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { Location } from '@/domain/value-objects/location';
import { SearchNearbyVendorsDTO, VendorResponseDTO } from '../dtos/vendor.dto';

export class SearchNearbyVendorsUseCase {
  constructor(private vendorRepository: IVendorRepository) {}

  async execute(dto: SearchNearbyVendorsDTO): Promise<{
    vendors: VendorResponseDTO[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Validar localização
    const location = Location.create(dto.latitude, dto.longitude);

    // Validar raio (máximo 50km)
    if (dto.radiusInMeters > 50000) {
      throw new Error('Radius cannot exceed 50km');
    }

    if (dto.radiusInMeters <= 0) {
      throw new Error('Radius must be positive');
    }

    const page = dto.page || 1;
    const limit = dto.limit || 20;

    // Buscar vendedores próximos
    const { vendors, total } = await this.vendorRepository.findNearby({
      location,
      radiusInMeters: dto.radiusInMeters,
      type: dto.type,
      isVerified: dto.isVerified,
      limit,
      offset: (page - 1) * limit,
    });

    // Mapear para DTO
    const vendorDTOs = vendors.map((vendor) => ({
      id: vendor.id,
      userId: vendor.userId,
      companyName: vendor.companyName,
      cnpj: vendor.cnpj.getFormatted(),
      type: vendor.type,
      location: {
        latitude: vendor.location.getLatitude(),
        longitude: vendor.location.getLongitude(),
      },
      address: vendor.address,
      phone: vendor.phone,
      isVerified: vendor.isVerified,
      createdAt: vendor.createdAt,
      updatedAt: vendor.updatedAt,
    }));

    return {
      vendors: vendorDTOs,
      total,
      page,
      limit,
    };
  }
}
