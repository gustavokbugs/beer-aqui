import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { UserRole } from '@/domain/entities/user.entity';
import { NotFoundError, UnauthorizedError } from '@/domain/errors/domain-errors';
import { VendorResponseDTO } from '@/application/dtos/vendor.dto';

export interface VerifyVendorDTO {
  vendorId: string;
  adminUserId: string; // Usuário que está realizando a verificação
}

export class VerifyVendorUseCase {
  constructor(
    private readonly vendorRepository: IVendorRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async execute(dto: VerifyVendorDTO): Promise<VendorResponseDTO> {
    // Verificar se o usuário é admin
    const adminUser = await this.userRepository.findById(dto.adminUserId);
    if (!adminUser) {
      throw new NotFoundError('Admin user not found');
    }

    if (adminUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedError('Only administrators can verify vendors');
    }

    // Buscar vendedor
    const vendor = await this.vendorRepository.findById(dto.vendorId);
    if (!vendor) {
      throw new NotFoundError('Vendor not found');
    }

    // Verificar o vendedor
    vendor.verify();

    // Salvar alterações
    const verifiedVendor = await this.vendorRepository.update(vendor);

    // Mapear para DTO de resposta
    return {
      id: verifiedVendor.id,
      userId: verifiedVendor.userId,
      companyName: verifiedVendor.companyName,
      cnpj: verifiedVendor.cnpj.getValue(),
      type: verifiedVendor.type,
      phone: verifiedVendor.phone,
      address: verifiedVendor.address,
      latitude: verifiedVendor.location.latitude,
      longitude: verifiedVendor.location.longitude,
      isVerified: verifiedVendor.isVerified,
      createdAt: verifiedVendor.createdAt,
    };
  }
}
