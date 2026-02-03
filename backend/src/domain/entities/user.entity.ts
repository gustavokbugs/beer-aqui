import { Email } from '../value-objects/email';
import { UserNotAdultError } from '../errors/domain-errors';

export enum UserRole {
  CLIENT = 'CLIENT',
  VENDOR = 'VENDOR',
}

export interface UserProps {
  id: string;
  name: string;
  email: Email;
  passwordHash: string;
  role: UserRole;
  isAdultConfirmed: boolean;
  emailVerified: boolean;
  emailVerifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export class User {
  private props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    const user = new User({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return user;
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): Email {
    return this.props.email;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get isAdultConfirmed(): boolean {
    return this.props.isAdultConfirmed;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get emailVerifiedAt(): Date | undefined {
    return this.props.emailVerifiedAt;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | undefined {
    return this.props.deletedAt;
  }

  get isDeleted(): boolean {
    return this.props.deletedAt !== undefined;
  }

  get isClient(): boolean {
    return this.props.role === UserRole.CLIENT;
  }

  get isVendor(): boolean {
    return this.props.role === UserRole.VENDOR;
  }

  // Domain methods
  confirmAdulthood(): void {
    this.props.isAdultConfirmed = true;
    this.touch();
  }

  verifyEmail(): void {
    this.props.emailVerified = true;
    this.props.emailVerifiedAt = new Date();
    this.touch();
  }

  changeName(name: string): void {
    if (name.trim().length < 2) {
      throw new Error('Name must have at least 2 characters');
    }
    this.props.name = name.trim();
    this.touch();
  }

  changeEmail(email: Email): void {
    this.props.email = email;
    this.props.emailVerified = false;
    this.props.emailVerifiedAt = undefined;
    this.touch();
  }

  changePassword(newPasswordHash: string): void {
    this.props.passwordHash = newPasswordHash;
    this.touch();
  }

  softDelete(): void {
    this.props.deletedAt = new Date();
    this.touch();
  }

  restore(): void {
    this.props.deletedAt = undefined;
    this.touch();
  }

  ensureIsAdult(): void {
    if (!this.props.isAdultConfirmed) {
      throw new UserNotAdultError();
    }
  }

  ensureEmailVerified(): void {
    if (!this.props.emailVerified) {
      throw new Error('Email not verified');
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON(): UserProps {
    return { ...this.props };
  }
}
