import { Ad, AdStatus } from '../entities/ad.entity';

export interface IAdRepository {
  /**
   * Encontra um anúncio por ID
   */
  findById(id: string): Promise<Ad | null>;

  /**
   * Salva um novo anúncio
   */
  save(ad: Ad): Promise<Ad>;

  /**
   * Atualiza um anúncio existente
   */
  update(ad: Ad): Promise<Ad>;

  /**
   * Remove um anúncio
   */
  delete(id: string): Promise<void>;

  /**
   * Lista anúncios por produto
   */
  findByProductId(productId: string): Promise<Ad[]>;

  /**
   * Lista anúncios ativos ordenados por prioridade
   */
  findActive(page: number, limit: number): Promise<{ ads: Ad[]; total: number }>;

  /**
   * Lista anúncios por status
   */
  findByStatus(status: AdStatus, page: number, limit: number): Promise<{
    ads: Ad[];
    total: number;
  }>;

  /**
   * Encontra anúncios expirados que ainda estão marcados como ativos
   */
  findExpiredActive(): Promise<Ad[]>;

  /**
   * Lista anúncios de um vendedor (através dos produtos)
   */
  findByVendorId(vendorId: string, page: number, limit: number): Promise<{
    ads: Ad[];
    total: number;
  }>;
}
