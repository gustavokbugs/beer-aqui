import { IUserRepository } from '@/domain/repositories/user.repository';
import { IHashService } from '@/domain/services/hash.service';
import { ITokenService } from '@/domain/services/token.service';
import { Email } from '@/domain/value-objects/email';
import { AuthenticateUserDTO, AuthResponseDTO } from '../dtos/user.dto';

export class AuthenticateUserUseCase {
  constructor(
    private userRepository: IUserRepository,
    private hashService: IHashService,
    private tokenService: ITokenService
  ) {}

  async execute(dto: AuthenticateUserDTO): Promise<AuthResponseDTO> {
    // Validar email
    const email = Email.create(dto.email);

    // Buscar usuário
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verificar se usuário foi deletado
    if (user.isDeleted) {
      throw new Error('Account has been deleted');
    }

    // Verificar senha
    const isPasswordValid = await this.hashService.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Verificar se é maior de idade
    user.ensureIsAdult();

    // Gerar tokens
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email.getValue(),
      role: user.role,
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id,
      email: user.email.getValue(),
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email.getValue(),
        role: user.role,
        emailVerified: user.emailVerified,
      },
      accessToken,
      refreshToken,
    };
  }
}
