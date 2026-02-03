import { CNPJ } from '../value-objects/cnpj';
import { Location } from '../value-objects/location';

export enum VendorType {
  BAR = 'bar',
  MERCADO = 'mercado',
  DISTRIBUIDORA = 'distribuidora',
}

export interface Address {
  street: string;
  number: string;
  city: string;
  state: string;
  zip: string;
}

export interface VendorProps {
  id: string;
  userId: string;
  companyName: string;
  cnpj: CNPJ;
  type: VendorType;
  location: Location;
  address: Address;
  phone?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Vendor {
  private props: VendorProps;

  private constructor(props: VendorProps) {
    this.props = props;
  }

  static create(props: Omit<VendorProps, 'id' | 'createdAt' | 'updatedAt'>): Vendor {
    const vendor = new Vendor({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return vendor;
  }

  static reconstitute(props: VendorProps): Vendor {
    return new Vendor(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get companyName(): string {
    return this.props.companyName;
  }

  get cnpj(): CNPJ {
    return this.props.cnpj;
  }

  get type(): VendorType {
    return this.props.type;
  }

  get location(): Location {
    return this.props.location;
  }

  get address(): Address {
    return this.props.address;
  }

  get phone(): string | undefined {
    return this.props.phone;
  }

  get isVerified(): boolean {
    return this.props.isVerified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isBar(): boolean {
    return this.props.type === VendorType.BAR;
  }

  get isMercado(): boolean {
    return this.props.type === VendorType.MERCADO;
  }

  get isDistribuidora(): boolean {
    return this.props.type === VendorType.DISTRIBUIDORA;
  }

  // Domain methods
  verify(): void {
    this.props.isVerified = true;
    this.touch();
  }

  unverify(): void {
    this.props.isVerified = false;
    this.touch();
  }

  updateCompanyName(name: string): void {
    if (name.trim().length < 2) {
      throw new Error('Company name must have at least 2 characters');
    }
    this.props.companyName = name.trim();
    this.touch();
  }

  updateLocation(location: Location): void {
    this.props.location = location;
    this.touch();
  }

  updateAddress(address: Address): void {
    this.props.address = address;
    this.touch();
  }

  updatePhone(phone: string): void {
    this.props.phone = phone;
    this.touch();
  }

  /**
   * Calcula distância até outro estabelecimento em metros
   */
  distanceTo(other: Vendor): number {
    return this.props.location.distanceTo(other.location);
  }

  /**
   * Calcula distância até outro estabelecimento em quilômetros
   */
  distanceToKm(other: Vendor): number {
    return this.props.location.distanceToKm(other.location);
  }

  /**
   * Calcula distância até uma localização em metros
   */
  distanceToLocation(location: Location): number {
    return this.props.location.distanceTo(location);
  }

  /**
   * Calcula distância até uma localização em quilômetros
   */
  distanceToLocationKm(location: Location): number {
    return this.props.location.distanceToKm(location);
  }

  /**
   * Verifica se está dentro de um raio em metros
   */
  isWithinRadius(location: Location, radiusInMeters: number): boolean {
    return this.distanceToLocation(location) <= radiusInMeters;
  }

  ensureIsVerified(): void {
    if (!this.props.isVerified) {
      throw new Error('Vendor is not verified');
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON(): VendorProps {
    return { ...this.props };
  }
}
