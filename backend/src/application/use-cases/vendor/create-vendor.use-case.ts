import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { Vendor, VendorType } from '@/domain/entities/vendor.entity';
import { CNPJ } from '@/domain/value-objects/cnpj';
import { Location } from '@/domain/value-objects/location';
import { CreateVendorDTO, VendorResponseDTO } from '../dtos/vendor.dto';

export class CreateVendorUseCase {
  constructor(
    private vendorRepository: IVendorRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(dto: CreateVendorDTO): Promise<VendorResponseDTO> {
    // Verificar se usuário existe
    const user = await this.userRepository.findById(dto.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Verificar se usuário é do tipo VENDOR
    if (!user.isVendor) {
      throw new Error('User must be a vendor');
    }

    // Verificar se usuário já tem um vendor
    const existingVendor = await this.vendorRepository.findByUserId(dto.userId);
    if (existingVendor) {
      throw new Error('User already has a vendor profile');
    }

    // Validar CNPJ
    const cnpj = CNPJ.create(dto.cnpj);

    // Verificar se CNPJ já existe
    const cnpjExists = await this.vendorRepository.existsByCNPJ(cnpj);
    if (cnpjExists) {
      throw new Error('CNPJ already registered');
    }

    // Validar localização
    const location = Location.create(dto.latitude, dto.longitude);

    // Validar nome da empresa
    if (dto.companyName.trim().length < 2) {
      throw new Error('Company name must be at least 2 characters long');
    }

    // Criar vendor
    const vendor = Vendor.create({
      userId: dto.userId,
      companyName: dto.companyName.trim(),
      cnpj,
      type: dto.type as VendorType,
      location,
      address: {
        street: dto.addressStreet,
        number: dto.addressNumber,
        city: dto.addressCity,
        state: dto.addressState,
        zip: dto.addressZip,
      },
      phone: dto.phone,
      isVerified: false,
    });

    // Salvar no banco
    const savedVendor = await this.vendorRepository.save(vendor);

    return {
      id: savedVendor.id,
      userId: savedVendor.userId,
      companyName: savedVendor.companyName,
      cnpj: savedVendor.cnpj.getFormatted(),
      type: savedVendor.type,
      location: {
        latitude: savedVendor.location.getLatitude(),
        longitude: savedVendor.location.getLongitude(),
      },
      address: savedVendor.address,
      phone: savedVendor.phone,
      isVerified: savedVendor.isVerified,
      createdAt: savedVendor.createdAt,
      updatedAt: savedVendor.updatedAt,
    };
  }
}
