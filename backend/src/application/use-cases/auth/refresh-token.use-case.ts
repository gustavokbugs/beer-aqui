import { IUserRepository } from '@/domain/repositories/user.repository';
import { ITokenService } from '@/domain/services/token.service';
import { AuthResponseDTO } from '@/application/dtos/user.dto';
import { UnauthorizedError, NotFoundError } from '@/domain/errors/domain-errors';

export interface RefreshTokenDTO {
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: RefreshTokenDTO): Promise<AuthResponseDTO> {
    // Verificar se o refresh token é válido
    const payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    if (!payload) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Buscar usuário
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verificar se o usuário está ativo
    if (user.deletedAt) {
      throw new UnauthorizedError('User account is deactivated');
    }

    // Gerar novos tokens
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email.getValue(),
      role: user.role,
    });

    const newRefreshToken = this.tokenService.generateRefreshToken({
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
        isAdult: user.isAdult,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}
