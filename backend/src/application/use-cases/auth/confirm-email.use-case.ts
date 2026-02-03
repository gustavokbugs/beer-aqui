import { IUserRepository } from '@/domain/repositories/user.repository';
import { ITokenService } from '@/domain/services/token.service';
import { NotFoundError, UnauthorizedError } from '@/domain/errors/domain-errors';

export interface ConfirmEmailDTO {
  token: string;
}

export interface ConfirmEmailResponseDTO {
  success: boolean;
  message: string;
}

export class ConfirmEmailUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: ConfirmEmailDTO): Promise<ConfirmEmailResponseDTO> {
    // Verificar token
    const payload = this.tokenService.verifyAccessToken(dto.token);
    if (!payload) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Buscar usuário
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }

    // Verificar se já foi confirmado
    if (user.emailVerified) {
      return {
        success: true,
        message: 'Email already verified',
      };
    }

    // Confirmar email
    user.verifyEmail();

    // Salvar
    await this.userRepository.update(user);

    return {
      success: true,
      message: 'Email verified successfully',
    };
  }
}
