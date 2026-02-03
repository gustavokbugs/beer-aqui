export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ITokenService {
  /**
   * Gera um access token JWT
   */
  generateAccessToken(payload: TokenPayload): string;

  /**
   * Gera um refresh token
   */
  generateRefreshToken(payload: TokenPayload): string;

  /**
   * Verifica e decodifica um token
   */
  verifyToken(token: string): TokenPayload;

  /**
   * Gera um token de verificação de email
   */
  generateEmailVerificationToken(userId: string): string;

  /**
   * Verifica um token de verificação de email
   */
  verifyEmailVerificationToken(token: string): { userId: string };

  /**
   * Gera um token de reset de senha
   */
  generatePasswordResetToken(userId: string): string;

  /**
   * Verifica um token de reset de senha
   */
  verifyPasswordResetToken(token: string): { userId: string };
}
