import { IVendorRepository } from '@/domain/repositories/vendor.repository';
import { Vendor, VendorType } from '@/domain/entities/vendor.entity';
import { CNPJ } from '@/domain/value-objects/cnpj';
import { Location } from '@/domain/value-objects/location';
import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';

export class PrismaVendorRepository implements IVendorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { id },
    });

    if (!vendor) return null;

    return this.toDomain(vendor);
  }

  async findByCNPJ(cnpj: CNPJ): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findUnique({
      where: { cnpj: cnpj.getValue() },
    });

    if (!vendor) return null;

    return this.toDomain(vendor);
  }

  async findByUserId(userId: string): Promise<Vendor | null> {
    const vendor = await this.prisma.vendor.findFirst({
      where: { userId },
    });

    if (!vendor) return null;

    return this.toDomain(vendor);
  }

  async findNearby(query: {
    location: Location;
    radiusInMeters: number;
    type?: string;
    isVerified?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ vendors: Vendor[]; total: number }> {
    const { location, radiusInMeters, type, isVerified, limit = 20, offset = 0 } = query;

    // Usar fórmula Haversine para calcular distância
    // Mais simples e rápida que PostGIS para este caso
    const radiusInKm = radiusInMeters / 1000;
    
    // Buscar todos os vendors e filtrar por distância em memória
    const whereClause: any = {};

    if (type) {
      whereClause.type = type;
    }

    if (isVerified !== undefined) {
      whereClause.isVerified = isVerified;
    }

    const allVendors = await this.prisma.vendor.findMany({
      where: whereClause,
    });

    // Calcular distância usando Haversine
    const vendorsWithDistance = allVendors.map((vendor) => {
      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        vendor.latitude,
        vendor.longitude
      );
      return { vendor, distance };
    });

    // Filtrar por raio
    const nearbyVendors = vendorsWithDistance
      .filter((v) => v.distance <= radiusInKm)
      .sort((a, b) => a.distance - b.distance);

    const total = nearbyVendors.length;
    const paginatedVendors = nearbyVendors.slice(offset, offset + limit);

    return {
      vendors: paginatedVendors.map((v) => this.toDomain(v.vendor)),
      total,
    };
  }

  // Fórmula Haversine para calcular distância entre dois pontos
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Raio da Terra em km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distância em km
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  async save(vendor: Vendor): Promise<Vendor> {
    const created = await this.prisma.vendor.create({
      data: {
        id: vendor.id,
        userId: vendor.userId,
        companyName: vendor.companyName,
        cnpj: vendor.cnpj.getValue(),
        type: vendor.type,
        latitude: vendor.location.latitude,
        longitude: vendor.location.longitude,
        addressStreet: vendor.address.street,
        addressNumber: vendor.address.number,
        addressCity: vendor.address.city,
        addressState: vendor.address.state,
        addressZip: vendor.address.zipCode,
        phone: vendor.phone ?? null,
        isVerified: vendor.isVerified,
        createdAt: vendor.createdAt,
        updatedAt: vendor.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async update(vendor: Vendor): Promise<Vendor> {
    const updated = await this.prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        companyName: vendor.companyName,
        cnpj: vendor.cnpj.getValue(),
        type: vendor.type,
        latitude: vendor.location.latitude,
        longitude: vendor.location.longitude,
        addressStreet: vendor.address.street,
        addressNumber: vendor.address.number,
        addressCity: vendor.address.city,
        addressState: vendor.address.state,
        addressZip: vendor.address.zipCode,
        phone: vendor.phone ?? null,
        isVerified: vendor.isVerified,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  private toDomain(raw: any): Vendor {
    return Vendor.reconstitute({
      id: raw.id,
      userId: raw.userId ?? raw.user_id,
      companyName: raw.companyName ?? raw.company_name,
      cnpj: CNPJ.create(raw.cnpj),
      type: raw.type as VendorType,
      location: Location.create(raw.latitude, raw.longitude),
      address: {
        street: raw.addressStreet ?? raw.address_street,
        number: raw.addressNumber ?? raw.address_number,
        city: raw.addressCity ?? raw.address_city,
        state: raw.addressState ?? raw.address_state,
        zipCode: raw.addressZip ?? raw.address_zip,
      },
      phone: raw.phone ?? undefined,
      isVerified: raw.isVerified ?? raw.is_verified,
      createdAt: raw.createdAt ?? raw.created_at,
      updatedAt: raw.updatedAt ?? raw.updated_at,
    });
  }
}
