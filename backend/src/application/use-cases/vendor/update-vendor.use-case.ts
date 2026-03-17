import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { Location } from '@/domain/value-objects/location';
import { VendorType } from '@/domain/entities/vendor.entity';
import { NotFoundError, ValidationError, UnauthorizedError } from '@/domain/errors/domain-errors';
import { VendorResponseDTO } from '@/application/dtos/vendor.dto';

export interface UpdateVendorDTO {
  vendorId: string;
  userId: string;
  companyName?: string;
  type?: VendorType;
  phone?: string;
  addressStreet?: string;
  addressNumber?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  latitude?: number;
  longitude?: number;
}

export class UpdateVendorUseCase {
  constructor(private readonly vendorRepository: IVendorRepository) {}

  async execute(dto: UpdateVendorDTO): Promise<VendorResponseDTO> {
    const vendor = await this.vendorRepository.findById(dto.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    if (vendor.userId !== dto.userId) {
      throw new UnauthorizedError('You are not authorized to update this vendor');
    }

    if (dto.companyName !== undefined) {
      if (dto.companyName.trim().length === 0) {
        throw new ValidationError('Company name cannot be empty');
      }
      vendor.updateCompanyName(dto.companyName.trim());
    }

    if (dto.type !== undefined) {
      if (!Object.values(VendorType).includes(dto.type)) {
        throw new ValidationError('Invalid vendor type');
      }
      vendor.updateType(dto.type);
    }

    if (dto.phone !== undefined) {
      vendor.updatePhone(dto.phone);
    }

    const shouldUpdateAddress =
      dto.addressStreet !== undefined ||
      dto.addressNumber !== undefined ||
      dto.addressCity !== undefined ||
      dto.addressState !== undefined ||
      dto.addressZip !== undefined;

    if (shouldUpdateAddress) {
      vendor.updateAddress({
        street: dto.addressStreet ?? vendor.address.street,
        number: dto.addressNumber ?? vendor.address.number,
        city: dto.addressCity ?? vendor.address.city,
        state: dto.addressState ?? vendor.address.state,
        zip: dto.addressZip ?? vendor.address.zip,
      });
    }

    if (dto.latitude !== undefined && dto.longitude !== undefined) {
      const newLocation = Location.create(dto.latitude, dto.longitude);
      vendor.updateLocation(newLocation);
    }

    const updatedVendor = await this.vendorRepository.update(vendor);

    return {
      id: updatedVendor.id,
      userId: updatedVendor.userId,
      companyName: updatedVendor.companyName,
      cnpj: updatedVendor.cnpj.getFormatted(),
      type: updatedVendor.type,
      location: {
        latitude: updatedVendor.location.getLatitude(),
        longitude: updatedVendor.location.getLongitude(),
      },
      address: updatedVendor.address,
      phone: updatedVendor.phone,
      isVerified: updatedVendor.isVerified,
      createdAt: updatedVendor.createdAt,
      updatedAt: updatedVendor.updatedAt,
    };
  }
}
