import { InvalidPriceError, InvalidVolumeError, InsufficientStockError } from '../errors/domain-errors';

// Volumes permitidos em ML
export const ALLOWED_VOLUMES = [
  250, // Garrafa pequena
  269, // Lata pequena
  275, // Long neck pequena
  310, // Long neck pequena
  330, // Lata/long neck padrão
  350, // Lata média
  355, // Importadas
  473, // Lata grande
  500, // Garrafa média
  550, // Garrafa grande
  600, // Garrafa
  1000, // Litro
  2000, // 2 litros
  5000, // Barril 5L
  20000, // Barril 20L
  30000, // Barril 30L
  50000, // Barril 50L
];

export interface ProductProps {
  id: string;
  vendorId: string;
  brand: string;
  volume: number;
  price: number;
  isActive: boolean;
  stockQuantity: number;
  description?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Product {
  private props: ProductProps;

  private constructor(props: ProductProps) {
    this.props = props;
    this.validate();
  }

  static create(props: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const product = new Product({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return product;
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }

  private validate(): void {
    if (this.props.price <= 0) {
      throw new InvalidPriceError(this.props.price);
    }

    if (!ALLOWED_VOLUMES.includes(this.props.volume)) {
      throw new InvalidVolumeError(this.props.volume);
    }

    if (this.props.stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get vendorId(): string {
    return this.props.vendorId;
  }

  get brand(): string {
    return this.props.brand;
  }

  get volume(): number {
    return this.props.volume;
  }

  get price(): number {
    return this.props.price;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get stockQuantity(): number {
    return this.props.stockQuantity;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get imageUrl(): string | undefined {
    return this.props.imageUrl;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isInStock(): boolean {
    return this.props.stockQuantity > 0;
  }

  get isOutOfStock(): boolean {
    return this.props.stockQuantity === 0;
  }

  // Domain methods
  activate(): void {
    this.props.isActive = true;
    this.touch();
  }

  deactivate(): void {
    this.props.isActive = false;
    this.touch();
  }

  updatePrice(price: number): void {
    if (price <= 0) {
      throw new InvalidPriceError(price);
    }
    this.props.price = price;
    this.touch();
  }

  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    this.props.stockQuantity = quantity;
    this.touch();
  }

  increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    this.props.stockQuantity += quantity;
    this.touch();
  }

  decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
    if (this.props.stockQuantity < quantity) {
      throw new InsufficientStockError(this.props.stockQuantity, quantity);
    }
    this.props.stockQuantity -= quantity;
    this.touch();
  }

  updateDescription(description: string): void {
    this.props.description = description;
    this.touch();
  }

  updateImage(imageUrl: string): void {
    this.props.imageUrl = imageUrl;
    this.touch();
  }

  updateBrand(brand: string): void {
    if (brand.trim().length < 2) {
      throw new Error('Brand name must have at least 2 characters');
    }
    this.props.brand = brand.trim();
    this.touch();
  }

  /**
   * Calcula o preço por litro
   */
  getPricePerLiter(): number {
    return (this.props.price / this.props.volume) * 1000;
  }

  /**
   * Calcula o volume em litros
   */
  getVolumeInLiters(): number {
    return this.props.volume / 1000;
  }

  ensureIsActive(): void {
    if (!this.props.isActive) {
      throw new Error('Product is not active');
    }
  }

  ensureInStock(): void {
    if (this.isOutOfStock) {
      throw new Error('Product is out of stock');
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON(): ProductProps {
    return { ...this.props };
  }
}
