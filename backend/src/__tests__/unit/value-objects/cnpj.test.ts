import { CNPJ } from '@/domain/value-objects/cnpj';
import { InvalidCNPJError } from '@/domain/errors/domain-errors';

describe('CNPJ Value Object', () => {
  const validCNPJ = '11.222.333/0001-81'; // CNPJ válido de teste

  describe('create', () => {
    it('should create a valid CNPJ', () => {
      const cnpj = CNPJ.create(validCNPJ);
      expect(cnpj.getValue()).toBe('11222333000181');
    });

    it('should clean CNPJ removing special characters', () => {
      const cnpj = CNPJ.create('11.222.333/0001-81');
      expect(cnpj.getValue()).toBe('11222333000181');
    });

    it('should throw error for invalid CNPJ', () => {
      expect(() => CNPJ.create('00000000000000')).toThrow(InvalidCNPJError);
      expect(() => CNPJ.create('11111111111111')).toThrow(InvalidCNPJError);
      expect(() => CNPJ.create('123')).toThrow(InvalidCNPJError);
      expect(() => CNPJ.create('invalid')).toThrow(InvalidCNPJError);
    });

    it('should validate CNPJ checksum', () => {
      // CNPJ com dígito verificador inválido
      expect(() => CNPJ.create('11.222.333/0001-99')).toThrow(InvalidCNPJError);
    });
  });

  describe('getFormatted', () => {
    it('should return formatted CNPJ', () => {
      const cnpj = CNPJ.create('11222333000181');
      expect(cnpj.getFormatted()).toBe('11.222.333/0001-81');
    });
  });

  describe('equals', () => {
    it('should return true for equal CNPJs', () => {
      const cnpj1 = CNPJ.create('11.222.333/0001-81');
      const cnpj2 = CNPJ.create('11222333000181');
      expect(cnpj1.equals(cnpj2)).toBe(true);
    });
  });

  describe('toString', () => {
    it('should return CNPJ string without formatting', () => {
      const cnpj = CNPJ.create('11.222.333/0001-81');
      expect(cnpj.toString()).toBe('11222333000181');
    });
  });
});
