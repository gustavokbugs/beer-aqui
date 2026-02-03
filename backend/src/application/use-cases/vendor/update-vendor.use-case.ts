import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { Location } from '@/domain/value-objects/location';
import { VendorType } from '@/domain/entities/vendor.entity';
import { NotFoundError, ValidationError, UnauthorizedError } from '@/domain/errors/domain-errors';
import { VendorResponseDTO } from '@/application/dtos/vendor.dto';

export interface UpdateVendorDTO {
  vendorId: string;
  userId: string; // Para verificar autorização
  companyName?: string;
  type?: VendorType;
  phone?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

export class UpdateVendorUseCase {
  constructor(private readonly vendorRepository: IVendorRepository) {}

  async execute(dto: UpdateVendorDTO): Promise<VendorResponseDTO> {
    // Buscar vendedor
    const vendor = await this.vendorRepository.findById(dto.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Verificar autorização (apenas o próprio usuário pode atualizar)
    if (vendor.userId !== dto.userId) {
      throw new UnauthorizedError('You are not authorized to update this vendor');
    }

    // Atualizar campos
    if (dto.companyName !== undefined) {
      if (dto.companyName.trim().length === 0) {
        throw new ValidationError('Company name cannot be empty');
      }
      vendor.companyName = dto.companyName.trim();
    }

    if (dto.type !== undefined) {
      if (!Object.values(VendorType).includes(dto.type)) {
        throw new ValidationError('Invalid vendor type');
      }
      vendor.type = dto.type;
    }

    if (dto.phone !== undefined) {
      vendor.phone = dto.phone || null;
    }

    if (dto.address !== undefined) {
      vendor.address = dto.address || null;
    }

    // Atualizar localização se fornecida
    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      const newLocation = Location.create(dto.latitude, dto.longitude);
      vendor.updateLocation(newLocation);
    }

    // Salvar alterações
    const updatedVendor = await this.vendorRepository.update(vendor);

    // Mapear para DTO de resposta
    return {
      id: updatedVendor.id,
      userId: updatedVendor.userId,
      companyName: updatedVendor.companyName,
      cnpj: updatedVendor.cnpj.getValue(),
      type: updatedVendor.type,
      phone: updatedVendor.phone,
      address: updatedVendor.address,
      latitude: updatedVendor.location.latitude,
      longitude: updatedVendor.location.longitude,
      isVerified: updatedVendor.isVerified,
      createdAt: updatedVendor.createdAt,
    };
  }
}
