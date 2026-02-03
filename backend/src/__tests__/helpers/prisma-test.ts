import { PrismaClient } from '@prisma/client';

// Força ambiente de teste
process.env['NODE_ENV'] = 'test';

// Cliente Prisma global para testes
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env['DATABASE_URL'],
    },
  },
});

// Limpa banco antes de todos os testes
beforeAll(async () => {
  // Garante que estamos em ambiente de teste
  if (!process.env['DATABASE_URL']?.includes('beeraqui_test')) {
    throw new Error('⚠️  PERIGO: Tentando rodar testes fora do banco de teste!');
  }
});

// Limpa dados entre cada teste
afterEach(async () => {
  // Ordem importa por causa das foreign keys
  await prisma.ad.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();
});

// Fecha conexão após todos os testes
afterAll(async () => {
  await prisma.$disconnect();
});
