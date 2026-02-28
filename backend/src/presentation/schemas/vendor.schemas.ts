import { z } from 'zod';
import { VendorType } from '@/domain/entities/vendor.entity';

export const createVendorSchema = z.object({
  body: z.object({
    companyName: z.string().min(2, 'Company name must be at least 2 characters').max(255),
    cnpj: z.string().regex(/^\d{14}$/, 'CNPJ must be 14 digits'),
    type: z.enum([VendorType.BAR, VendorType.MERCADO, VendorType.DISTRIBUIDORA], {
      errorMap: () => ({ message: 'Type must be bar, mercado, or distribuidora' })
    }),
    addressStreet: z.string().min(1, 'Street is required'),
    addressNumber: z.string().min(1, 'Number is required'),
    addressCity: z.string().min(1, 'City is required'),
    addressState: z.string().length(2, 'State must be 2 characters').toUpperCase(),
    addressZip: z.string().regex(/^\d{8}$/, 'ZIP code must be 8 digits'),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    phone: z.string().optional(),
  }),
});

export const updateVendorSchema = z.object({
  body: z.object({
    companyName: z.string().min(2).max(255).optional(),
    phone: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    addressStreet: z.string().min(1).optional(),
    addressNumber: z.string().min(1).optional(),
    addressCity: z.string().min(1).optional(),
    addressState: z.string().length(2).optional(),
    addressZip: z.string().regex(/^\d{8}$/).optional(),
  }),
});
