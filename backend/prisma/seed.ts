import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes
  console.log('🗑️  Limpando dados existentes...');
  await prisma.ad.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('👥 Criando usuários...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  const clientUser = await prisma.user.create({
    data: {
      name: 'Cliente Teste',
      email: 'cliente@test.com',
      passwordHash: hashedPassword,
      role: 'CLIENT',
      isAdultConfirmed: true,
      emailVerified: true,
    },
  });

  const vendorUser1 = await prisma.user.create({
    data: {
      name: 'João Silva',
      email: 'joao@bar.com',
      passwordHash: hashedPassword,
      role: 'VENDOR',
      isAdultConfirmed: true,
      emailVerified: true,
    },
  });

  const vendorUser2 = await prisma.user.create({
    data: {
      name: 'Maria Santos',
      email: 'maria@mercado.com',
      passwordHash: hashedPassword,
      role: 'VENDOR',
      isAdultConfirmed: true,
      emailVerified: true,
    },
  });

  const vendorUser3 = await prisma.user.create({
    data: {
      name: 'Pedro Costa',
      email: 'pedro@distribuidora.com',
      passwordHash: hashedPassword,
      role: 'VENDOR',
      isAdultConfirmed: true,
      emailVerified: true,
    },
  });

  // Criar vendedores
  console.log('🏪 Criando estabelecimentos...');
  
  const vendor1 = await prisma.vendor.create({
    data: {
      userId: vendorUser1.id,
      companyName: 'Bar do João',
      cnpj: '12345678000190',
      type: 'bar',
      latitude: -23.550520,
      longitude: -46.633308,
      addressStreet: 'Av. Paulista',
      addressNumber: '1000',
      addressCity: 'São Paulo',
      addressState: 'SP',
      addressZip: '01310-100',
      phone: '(11) 98888-8888',
      isVerified: true,
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      userId: vendorUser2.id,
      companyName: 'Mercado da Maria',
      cnpj: '98765432000111',
      type: 'mercado',
      latitude: -23.561414,
      longitude: -46.656178,
      addressStreet: 'Rua Augusta',
      addressNumber: '500',
      addressCity: 'São Paulo',
      addressState: 'SP',
      addressZip: '01305-000',
      phone: '(11) 97777-7777',
      isVerified: true,
    },
  });

  const vendor3 = await prisma.vendor.create({
    data: {
      userId: vendorUser3.id,
      companyName: 'Distribuidora Costa',
      cnpj: '11122233000144',
      type: 'distribuidora',
      latitude: -23.547200,
      longitude: -46.638500,
      addressStreet: 'Av. Brigadeiro Faria Lima',
      addressNumber: '1500',
      addressCity: 'São Paulo',
      addressState: 'SP',
      addressZip: '01452-000',
      phone: '(11) 96666-6666',
      isVerified: true,
    },
  });

  // Criar produtos
  console.log('🍺 Criando produtos...');
  
  // Produtos do Bar do João
  const produto1 = await prisma.product.create({
    data: {
      vendorId: vendor1.id,
      brand: 'Brahma',
      volume: 350,
      price: 4.50,
      isActive: true,
      stockQuantity: 100,
      description: 'Cerveja Brahma Chopp 350ml',
    },
  });

  const produto2 = await prisma.product.create({
    data: {
      vendorId: vendor1.id,
      brand: 'Skol',
      volume: 350,
      price: 4.00,
      isActive: true,
      stockQuantity: 150,
      description: 'Cerveja Skol Pilsen 350ml',
    },
  });

  const produto3 = await prisma.product.create({
    data: {
      vendorId: vendor1.id,
      brand: 'Antarctica',
      volume: 350,
      price: 4.20,
      isActive: true,
      stockQuantity: 80,
      description: 'Cerveja Antarctica Original 350ml',
    },
  });

  // Produtos do Mercado da Maria
  const produto4 = await prisma.product.create({
    data: {
      vendorId: vendor2.id,
      brand: 'Heineken',
      volume: 330,
      price: 6.50,
      isActive: true,
      stockQuantity: 200,
      description: 'Cerveja Heineken Long Neck 330ml',
    },
  });

  const produto5 = await prisma.product.create({
    data: {
      vendorId: vendor2.id,
      brand: 'Brahma',
      volume: 1000,
      price: 8.90,
      isActive: true,
      stockQuantity: 120,
      description: 'Cerveja Brahma Chopp 1 Litro',
    },
  });

  const produto6 = await prisma.product.create({
    data: {
      vendorId: vendor2.id,
      brand: 'Stella Artois',
      volume: 330,
      price: 7.00,
      isActive: true,
      stockQuantity: 90,
      description: 'Cerveja Stella Artois Long Neck 330ml',
    },
  });

  // Produtos da Distribuidora
  const produto7 = await prisma.product.create({
    data: {
      vendorId: vendor3.id,
      brand: 'Budweiser',
      volume: 350,
      price: 5.50,
      isActive: true,
      stockQuantity: 500,
      description: 'Cerveja Budweiser Lata 350ml',
    },
  });

  const produto8 = await prisma.product.create({
    data: {
      vendorId: vendor3.id,
      brand: 'Corona',
      volume: 355,
      price: 8.00,
      isActive: true,
      stockQuantity: 300,
      description: 'Cerveja Corona Extra 355ml',
    },
  });

  // Criar anúncios
  console.log('📢 Criando anúncios...');
  
  await prisma.ad.create({
    data: {
      productId: produto1.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
      priority: 1,
      status: 'active',
      paymentStatus: 'paid',
    },
  });

  await prisma.ad.create({
    data: {
      productId: produto4.id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 dias
      priority: 2,
      status: 'active',
      paymentStatus: 'paid',
    },
  });

  await prisma.ad.create({
    data: {
      productId: produto8.id,
      startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // começou 5 dias atrás
      endDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // terminou ontem
      priority: 1,
      status: 'expired',
      paymentStatus: 'paid',
    },
  });

  console.log('✅ Seed concluído!');
  console.log('');
  console.log('📊 Dados criados:');
  console.log(`  • ${await prisma.user.count()} usuários`);
  console.log(`  • ${await prisma.vendor.count()} vendedores`);
  console.log(`  • ${await prisma.product.count()} produtos`);
  console.log(`  • ${await prisma.ad.count()} anúncios`);
  console.log('');
  console.log('🔑 Credenciais de teste:');
  console.log('  • Email: cliente@test.com | Senha: 123456');
  console.log('  • Email: joao@bar.com | Senha: 123456');
  console.log('  • Email: maria@mercado.com | Senha: 123456');
  console.log('  • Email: pedro@distribuidora.com | Senha: 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
