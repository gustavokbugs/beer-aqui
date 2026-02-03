export interface CreateAdDTO {
  productId: string;
  startDate: Date;
  endDate: Date;
  priority: number;
}

export interface AdResponseDTO {
  id: string;
  productId: string;
  startDate: Date;
  endDate: Date;
  priority: number;
  status: string;
  paymentStatus: string;
  durationInDays: number;
  remainingDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateAdPriorityDTO {
  priority: number;
}

export interface ExtendAdDTO {
  newEndDate: Date;
}
