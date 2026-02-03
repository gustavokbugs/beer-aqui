import { Vendor } from '../entities/vendor.entity';
import { CNPJ } from '../value-objects/cnpj';
import { Location } from '../value-objects/location';

export interface NearbyVendorsQuery {
  location: Location;
  radiusInMeters: number;
  type?: string;
  isVerified?: boolean;
  limit?: number;
  offset?: number;
}

export interface IVendorRepository {
  /**
   * Encontra um vendedor por ID
   */
  findById(id: string): Promise<Vendor | null>;

  /**
   * Encontra um vendedor por user ID
   */
  findByUserId(userId: string): Promise<Vendor | null>;

  /**
   * Encontra um vendedor por CNPJ
   */
  findByCNPJ(cnpj: CNPJ): Promise<Vendor | null>;

  /**
   * Salva um novo vendedor
   */
  save(vendor: Vendor): Promise<Vendor>;

  /**
   * Atualiza um vendedor existente
   */
  update(vendor: Vendor): Promise<Vendor>;

  /**
   * Remove um vendedor
   */
  delete(id: string): Promise<void>;

  /**
   * Verifica se um CNPJ já está em uso
   */
  existsByCNPJ(cnpj: CNPJ): Promise<boolean>;

  /**
   * Busca vendedores próximos a uma localização
   */
  findNearby(query: NearbyVendorsQuery): Promise<{ vendors: Vendor[]; total: number }>;

  /**
   * Lista todos os vendedores com paginação
   */
  findAll(page: number, limit: number): Promise<{ vendors: Vendor[]; total: number }>;
}
