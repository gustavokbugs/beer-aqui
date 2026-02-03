import { ExpiredAdError } from '../errors/domain-errors';

export enum AdStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export interface AdProps {
  id: string;
  productId: string;
  startDate: Date;
  endDate: Date;
  priority: number;
  status: AdStatus;
  paymentStatus: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Ad {
  private props: AdProps;

  private constructor(props: AdProps) {
    this.props = props;
    this.validate();
  }

  static create(props: Omit<AdProps, 'id' | 'createdAt' | 'updatedAt'>): Ad {
    const ad = new Ad({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return ad;
  }

  static reconstitute(props: AdProps): Ad {
    return new Ad(props);
  }

  private validate(): void {
    if (this.props.endDate <= this.props.startDate) {
      throw new Error('End date must be after start date');
    }

    if (this.props.priority < 1 || this.props.priority > 10) {
      throw new Error('Priority must be between 1 and 10');
    }
  }

  // Getters
  get id(): string {
    return this.props.id;
  }

  get productId(): string {
    return this.props.productId;
  }

  get startDate(): Date {
    return this.props.startDate;
  }

  get endDate(): Date {
    return this.props.endDate;
  }

  get priority(): number {
    return this.props.priority;
  }

  get status(): AdStatus {
    return this.props.status;
  }

  get paymentStatus(): PaymentStatus {
    return this.props.paymentStatus;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get isActive(): boolean {
    return this.props.status === AdStatus.ACTIVE && !this.isExpired();
  }

  get isExpired(): boolean {
    return this.props.endDate < new Date();
  }

  get isCancelled(): boolean {
    return this.props.status === AdStatus.CANCELLED;
  }

  get isPaid(): boolean {
    return this.props.paymentStatus === PaymentStatus.PAID;
  }

  get isPending(): boolean {
    return this.props.paymentStatus === PaymentStatus.PENDING;
  }

  get isRefunded(): boolean {
    return this.props.paymentStatus === PaymentStatus.REFUNDED;
  }

  // Domain methods
  activate(): void {
    if (this.isExpired) {
      throw new ExpiredAdError();
    }
    if (!this.isPaid) {
      throw new Error('Cannot activate ad with pending payment');
    }
    this.props.status = AdStatus.ACTIVE;
    this.touch();
  }

  cancel(): void {
    this.props.status = AdStatus.CANCELLED;
    this.touch();
  }

  expire(): void {
    this.props.status = AdStatus.EXPIRED;
    this.touch();
  }

  markAsPaid(): void {
    this.props.paymentStatus = PaymentStatus.PAID;
    this.touch();
  }

  refund(): void {
    this.props.paymentStatus = PaymentStatus.REFUNDED;
    this.props.status = AdStatus.CANCELLED;
    this.touch();
  }

  updatePriority(priority: number): void {
    if (priority < 1 || priority > 10) {
      throw new Error('Priority must be between 1 and 10');
    }
    this.props.priority = priority;
    this.touch();
  }

  extendPeriod(newEndDate: Date): void {
    if (newEndDate <= this.props.endDate) {
      throw new Error('New end date must be after current end date');
    }
    this.props.endDate = newEndDate;
    if (this.isExpired) {
      this.props.status = AdStatus.ACTIVE;
    }
    this.touch();
  }

  /**
   * Retorna a duração do anúncio em dias
   */
  getDurationInDays(): number {
    const diff = this.props.endDate.getTime() - this.props.startDate.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Retorna os dias restantes até expiração
   */
  getRemainingDays(): number {
    const now = new Date();
    if (now >= this.props.endDate) {
      return 0;
    }
    const diff = this.props.endDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Verifica se o anúncio está ativo no momento
   */
  isActiveNow(): boolean {
    const now = new Date();
    return (
      this.props.status === AdStatus.ACTIVE &&
      now >= this.props.startDate &&
      now <= this.props.endDate &&
      this.isPaid
    );
  }

  ensureIsActive(): void {
    if (!this.isActiveNow()) {
      throw new Error('Ad is not active');
    }
  }

  ensureIsPaid(): void {
    if (!this.isPaid) {
      throw new Error('Ad payment is pending');
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  toJSON(): AdProps {
    return { ...this.props };
  }
}
