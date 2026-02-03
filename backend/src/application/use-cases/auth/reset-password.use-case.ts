import { IUserRepository } from '@/domain/repositories/user.repository';
import { ITokenService } from '@/domain/services/token.service';
import { IHashService } from '@/domain/services/hash.service';
import { NotFoundError, UnauthorizedError, ValidationError } from '@/domain/errors/domain-errors';

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponseDTO {
  success: boolean;
  message: string;
}

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService,
    private readonly hashService: IHashService
  ) {}

  async execute(dto: ResetPasswordDTO): Promise<ResetPasswordResponseDTO> {
    // Validar senhas
    if (dto.newPassword !== dto.confirmPassword) {
      throw new ValidationError('Passwords do not match');
    }

    if (dto.newPassword.length < 8) {
      throw new ValidationError('Password must be at least 8 characters long');
    }

    // Verificar token
    const payload = this.tokenService.verifyAccessToken(dto.token);
    if (!payload) {
      throw new UnauthorizedError('Invalid or expired reset token');
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

    // Hash da nova senha
    const hashedPassword = await this.hashService.hash(dto.newPassword);

    // Atualizar senha (criando novo User com senha atualizada)
    const updatedUser = {
      ...user,
      passwordHash: hashedPassword,
    };

    await this.userRepository.update(updatedUser);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }
}
