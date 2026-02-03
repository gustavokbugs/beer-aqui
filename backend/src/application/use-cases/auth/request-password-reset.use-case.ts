import { IUserRepository } from '@/domain/repositories/user.repository';
import { ITokenService } from '@/domain/services/token.service';
import { Email } from '@/domain/value-objects/email';
import { NotFoundError } from '@/domain/errors/domain-errors';

export interface RequestPasswordResetDTO {
  email: string;
}

export interface RequestPasswordResetResponseDTO {
  success: boolean;
  message: string;
  resetToken?: string; // Em produção, isso seria enviado por email
}

export class RequestPasswordResetUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: RequestPasswordResetDTO): Promise<RequestPasswordResetResponseDTO> {
    // Validar e normalizar email
    const email = Email.create(dto.email);

    // Buscar usuário
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return {
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      };
    }

    // Verificar se o usuário está ativo
    if (user.deletedAt) {
      return {
        success: true,
        message: 'If the email exists, a password reset link has been sent',
      };
    }

    // Gerar token de reset (válido por 1 hora)
    const resetToken = this.tokenService.generateAccessToken(
      {
        userId: user.id,
        email: user.email.getValue(),
        role: user.role,
      },
      '1h' // Expiração de 1 hora
    );

    // TODO: Em produção, enviar email com o token
    // await emailService.sendPasswordResetEmail(user.email.getValue(), resetToken);

    return {
      success: true,
      message: 'If the email exists, a password reset link has been sent',
      resetToken, // Retornado apenas para desenvolvimento/testes
    };
  }
}
