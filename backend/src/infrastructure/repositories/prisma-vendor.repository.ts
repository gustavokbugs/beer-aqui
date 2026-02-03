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

  async findNearby(
    location: Location,
    radiusKm: number,
    type?: VendorType
  ): Promise<Vendor[]> {
    // Query geoespacial usando PostGIS
    // ST_DWithin usa metros, então convertemos km para metros
    const radiusMeters = radiusKm * 1000;

    const query = Prisma.sql`
      SELECT * FROM "Vendor"
      WHERE ST_DWithin(
        location::geography,
        ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography,
        ${radiusMeters}
      )
      ${type ? Prisma.sql`AND type = ${type}` : Prisma.empty}
      ORDER BY ST_Distance(
        location::geography,
        ST_SetSRID(ST_MakePoint(${location.longitude}, ${location.latitude}), 4326)::geography
      )
    `;

    const vendors = await this.prisma.$queryRaw<any[]>(query);

    return vendors.map((v) => this.toDomain(v));
  }

  async save(vendor: Vendor): Promise<Vendor> {
    const created = await this.prisma.vendor.create({
      data: {
        id: vendor.id,
        userId: vendor.userId,
        companyName: vendor.companyName,
        cnpj: vendor.cnpj.getValue(),
        type: vendor.type,
        location: Prisma.sql`ST_SetSRID(ST_MakePoint(${vendor.location.longitude}, ${vendor.location.latitude}), 4326)`,
        address: vendor.address,
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
        location: Prisma.sql`ST_SetSRID(ST_MakePoint(${vendor.location.longitude}, ${vendor.location.latitude}), 4326)`,
        address: vendor.address,
        phone: vendor.phone ?? null,
        isVerified: vendor.isVerified,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  private toDomain(raw: any): Vendor {
    // Extrair latitude e longitude do PostGIS geometry
    // O formato retornado pelo PostGIS é um objeto ou string que precisamos parsear
    let latitude: number;
    let longitude: number;

    if (typeof raw.location === 'string') {
      // Parse do formato WKT: "POINT(longitude latitude)"
      const matches = raw.location.match(/POINT\(([^ ]+) ([^ ]+)\)/);
      if (matches) {
        longitude = parseFloat(matches[1]);
        latitude = parseFloat(matches[2]);
      } else {
        // Fallback para coordenadas padrão
        latitude = 0;
        longitude = 0;
      }
    } else if (raw.location && typeof raw.location === 'object') {
      // Se vier como objeto com coordenadas
      latitude = raw.location.coordinates?.[1] ?? raw.location.y ?? 0;
      longitude = raw.location.coordinates?.[0] ?? raw.location.x ?? 0;
    } else {
      latitude = 0;
      longitude = 0;
    }

    return Vendor.reconstitute({
      id: raw.id,
      userId: raw.userId,
      companyName: raw.companyName,
      cnpj: CNPJ.create(raw.cnpj),
      type: raw.type as VendorType,
      location: Location.create(latitude, longitude),
      address: raw.address,
      phone: raw.phone ?? undefined,
      isVerified: raw.isVerified,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
