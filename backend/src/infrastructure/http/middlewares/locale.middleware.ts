import { Request, Response, NextFunction } from 'express';
import { detectLanguage } from '@/config/i18n';

// Extender Request para incluir locale
declare global {
  namespace Express {
    interface Request {
      locale: string;
    }
  }
}

export function localeMiddleware(req: Request, _res: Response, next: NextFunction): void {
  // Detectar idioma do header Accept-Language
  const acceptLanguage = req.headers['accept-language'];
  req.locale = detectLanguage(acceptLanguage);
  next();
}
