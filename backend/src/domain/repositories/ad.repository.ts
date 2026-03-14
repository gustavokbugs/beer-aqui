import { Ad, AdStatus } from '../entities/ad.entity';

export interface IAdRepository {
  findById(id: string): Promise<Ad | null>;
  save(ad: Ad): Promise<Ad>;
  update(ad: Ad): Promise<Ad>;
  delete(id: string): Promise<void>;
  findByProductId(productId: string): Promise<Ad[]>;
  findActive(page: number, limit: number): Promise<{ ads: Ad[]; total: number }>;
  findByStatus(status: AdStatus, page: number, limit: number): Promise<{
    ads: Ad[];
    total: number;
  }>;
  findExpiredActive(): Promise<Ad[]>;
  findByVendorId(vendorId: string, page: number, limit: number): Promise<{
    ads: Ad[];
    total: number;
  }>;
}
