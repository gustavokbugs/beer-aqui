import { InvalidCNPJError } from '../errors/domain-errors';

export class CNPJ {
  private readonly value: string;

  private constructor(cnpj: string) {
    this.value = cnpj;
  }

  static create(cnpj: string): CNPJ {
    const cleanCNPJ = this.clean(cnpj);
    if (!this.isValid(cleanCNPJ)) {
      throw new InvalidCNPJError(cnpj);
    }
    return new CNPJ(cleanCNPJ);
  }

  static clean(cnpj: string): string {
    return cnpj.replace(/[^\d]/g, '');
  }

  static isValid(cnpj: string): boolean {
    const cleanCNPJ = this.clean(cnpj);

    // CNPJ deve ter 14 dígitos
    if (cleanCNPJ.length !== 14) {
      return false;
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCNPJ)) {
      return false;
    }

    // Validação dos dígitos verificadores
    let size = cleanCNPJ.length - 2;
    let numbers = cleanCNPJ.substring(0, size);
    const digits = cleanCNPJ.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) {
      return false;
    }

    size = size + 1;
    numbers = cleanCNPJ.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) {
        pos = 9;
      }
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) {
      return false;
    }

    return true;
  }

  getValue(): string {
    return this.value;
  }

  getFormatted(): string {
    // 00.000.000/0000-00
    return this.value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  }

  equals(other: CNPJ): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
