import { IUserRepository } from '@/domain/repositories/user.repository';
import { IHashService } from '@/domain/services/hash.service';
import { ITokenService } from '@/domain/services/token.service';
import { User, UserRole } from '@/domain/entities/user.entity';
import { Email } from '@/domain/value-objects/email';
import { RegisterUserDTO, AuthResponseDTO } from '../dtos/user.dto';

export class RegisterUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService
  ) {}

  async execute(dto: RegisterUserDTO): Promise<AuthResponseDTO> {
    // Validar email
    const email = Email.create(dto.email);

    // Verificar se email já existe
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Validar senha
    if (dto.password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    // Validar nome
    if (dto.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters long');
    }

    // Validar confirmação de maioridade
    if (!dto.isAdultConfirmed) {
      throw new Error('You must be at least 18 years old');
    }

    // Hash da senha
    const passwordHash = await this.hashService.hash(dto.password);

    // Criar usuário
    const user = User.create({
      name: dto.name.trim(),
      email,
      passwordHash,
      role: dto.role as UserRole,
      isAdultConfirmed: dto.isAdultConfirmed,
      emailVerified: false,
    });

    // Salvar no banco
    const savedUser = await this.userRepository.save(user);

    // Gerar tokens
    const accessToken = this.tokenService.generateAccessToken({
      userId: savedUser.id,
      email: savedUser.email.getValue(),
      role: savedUser.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      userId: savedUser.id,
      email: savedUser.email.getValue(),
      role: savedUser.role,
    });

    return {
      user: {
        id: savedUser.id,
        name: savedUser.name,
        email: savedUser.email.getValue(),
        role: savedUser.role,
        emailVerified: savedUser.emailVerified,
      },
      accessToken,
      refreshToken,
    };
  }
}
