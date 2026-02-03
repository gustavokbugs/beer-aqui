import { detectLanguage, t } from '../../config/i18n';

describe('i18n Configuration', () => {
  describe('detectLanguage', () => {
    it('should return pt-BR as default when no header is provided', () => {
      const language = detectLanguage();
      expect(language).toBe('pt-BR');
    });

    it('should detect Portuguese from pt-BR header', () => {
      const language = detectLanguage('pt-BR,pt;q=0.9');
      expect(language).toBe('pt-BR');
    });

    it('should detect English from en-US header', () => {
      const language = detectLanguage('en-US,en;q=0.9');
      expect(language).toBe('en');
    });

    it('should detect Spanish from es header', () => {
      const language = detectLanguage('es-ES,es;q=0.9');
      expect(language).toBe('es');
    });

    it('should prioritize language with higher q value', () => {
      const language = detectLanguage('en;q=0.5,pt-BR;q=0.9,es;q=0.7');
      expect(language).toBe('pt-BR');
    });

    it('should fallback to pt-BR for unsupported language', () => {
      const language = detectLanguage('fr-FR,fr;q=0.9');
      expect(language).toBe('pt-BR');
    });
  });

  describe('t (translation)', () => {
    it('should translate error messages in Portuguese', () => {
      const message = t('errors.not_found', {}, 'pt-BR');
      expect(message).toBe('Recurso não encontrado');
    });

    it('should translate error messages in English', () => {
      const message = t('errors.not_found', {}, 'en');
      expect(message).toBe('Resource not found');
    });

    it('should translate error messages in Spanish', () => {
      const message = t('errors.not_found', {}, 'es');
      expect(message).toBe('Recurso no encontrado');
    });

    it('should interpolate variables in Portuguese', () => {
      const message = t('validation.required', { field: 'Email' }, 'pt-BR');
      expect(message).toBe('Email é obrigatório');
    });

    it('should interpolate variables in English', () => {
      const message = t('validation.required', { field: 'Email' }, 'en');
      expect(message).toBe('Email is required');
    });

    it('should translate nested error messages', () => {
      const message = t('errors.user.not_found', {}, 'pt-BR');
      expect(message).toBe('Usuário não encontrado');
    });
  });
});
