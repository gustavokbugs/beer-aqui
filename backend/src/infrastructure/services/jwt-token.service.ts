import jwt from 'jsonwebtoken';
import { ITokenService, TokenPayload } from '@/domain/services/token.service';

export class JwtTokenService implements ITokenService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExpiration: string;
  private readonly refreshTokenExpiration: string;

  constructor(
    accessTokenSecret: string,
    refreshTokenSecret: string,
    accessTokenExpiration: string = '15m',
    refreshTokenExpiration: string = '7d'
  ) {
    this.accessTokenSecret = accessTokenSecret;
    this.refreshTokenSecret = refreshTokenSecret;
    this.accessTokenExpiration = accessTokenExpiration;
    this.refreshTokenExpiration = refreshTokenExpiration;
  }

  generateAccessToken(payload: TokenPayload, expiresIn?: string): string {
    return jwt.sign(payload, this.accessTokenSecret, {
      expiresIn: expiresIn || this.accessTokenExpiration,
    });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.refreshTokenSecret, {
      expiresIn: this.refreshTokenExpiration,
    });
  }

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.accessTokenSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.refreshTokenSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
