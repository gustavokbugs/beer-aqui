export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class InvalidEmailError extends ValidationError {
  constructor(email: string) {
    super(`Invalid email: ${email}`);
    this.name = 'InvalidEmailError';
  }
}

export class InvalidCNPJError extends ValidationError {
  constructor(cnpj: string) {
    super(`Invalid CNPJ: ${cnpj}`);
    this.name = 'InvalidCNPJError';
  }
}

export class InvalidCoordinatesError extends ValidationError {
  constructor(latitude: number, longitude: number) {
    super(`Invalid coordinates: latitude=${latitude}, longitude=${longitude}`);
    this.name = 'InvalidCoordinatesError';
  }
}

export class InvalidPriceError extends ValidationError {
  constructor(price: number) {
    super(`Price must be positive: ${price}`);
    this.name = 'InvalidPriceError';
  }
}

export class InvalidVolumeError extends ValidationError {
  constructor(volume: number) {
    super(`Invalid volume: ${volume}ml`);
    this.name = 'InvalidVolumeError';
  }
}

export class UserNotAdultError extends DomainError {
  constructor() {
    super('User must be at least 18 years old');
    this.name = 'UserNotAdultError';
  }
}

export class ExpiredAdError extends DomainError {
  constructor() {
    super('Advertisement has expired');
    this.name = 'ExpiredAdError';
  }
}

export class InsufficientStockError extends DomainError {
  constructor(available: number, requested: number) {
    super(`Insufficient stock: available=${available}, requested=${requested}`);
    this.name = 'InsufficientStockError';
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictError';
  }
}
