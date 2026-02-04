import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Santa Cruz do Sul, RS - Coordenadas e bairros
const SANTA_CRUZ_CENTER = { lat: -29.7177, lng: -52.4258 };

const BAIRROS = [
  { nome: 'Centro', lat: -29.7177, lng: -52.4258 },
  { nome: 'Arroio Grande', lat: -29.7089, lng: -52.4456 },
  { nome: 'Bom Jesus', lat: -29.7245, lng: -52.4189 },
  { nome: 'Goiás', lat: -29.7312, lng: -52.4298 },
  { nome: 'Higienópolis', lat: -29.7098, lng: -52.4267 },
  { nome: 'Menino Deus', lat: -29.7201, lng: -52.4401 },
  { nome: 'Santo Inácio', lat: -29.7156, lng: -52.4123 },
  { nome: 'Universitário', lat: -29.7289, lng: -52.4356 },
  { nome: 'Várzea', lat: -29.7134, lng: -52.4512 },
  { nome: 'Linha Santa Cruz', lat: -29.7423, lng: -52.4187 },
  { nome: 'Esmeralda', lat: -29.7056, lng: -52.4378 },
  { nome: 'Senai', lat: -29.7267, lng: -52.4145 },
];

// Cervejas reais brasileiras e importadas
const CERVEJAS = [
  // Nacionais - Skol
  { marca: 'Skol', tipo: 'Pilsen', ml: 269, abv: 4.7 },
  { marca: 'Skol', tipo: 'Pilsen', ml: 350, abv: 4.7 },
  { marca: 'Skol', tipo: 'Pilsen', ml: 473, abv: 4.7 },
  { marca: 'Skol', tipo: 'Pilsen', ml: 600, abv: 4.7 },
  { marca: 'Skol', tipo: 'Pilsen', ml: 1000, abv: 4.7 },
  
  // Brahma
  { marca: 'Brahma', tipo: 'Pilsen', ml: 269, abv: 4.8 },
  { marca: 'Brahma', tipo: 'Pilsen', ml: 350, abv: 4.8 },
  { marca: 'Brahma', tipo: 'Pilsen', ml: 473, abv: 4.8 },
  { marca: 'Brahma', tipo: 'Pilsen', ml: 600, abv: 4.8 },
  { marca: 'Brahma', tipo: 'Pilsen', ml: 1000, abv: 4.8 },
  { marca: 'Brahma Duplo Malte', tipo: 'Lager', ml: 350, abv: 5.0 },
  
  // Antarctica
  { marca: 'Antarctica', tipo: 'Pilsen', ml: 269, abv: 4.5 },
  { marca: 'Antarctica', tipo: 'Pilsen', ml: 350, abv: 4.5 },
  { marca: 'Antarctica', tipo: 'Pilsen', ml: 473, abv: 4.5 },
  { marca: 'Antarctica', tipo: 'Pilsen', ml: 600, abv: 4.5 },
  { marca: 'Antarctica Sub Zero', tipo: 'Pilsen', ml: 350, abv: 4.5 },
  
  // Budweiser
  { marca: 'Budweiser', tipo: 'American Lager', ml: 269, abv: 5.0 },
  { marca: 'Budweiser', tipo: 'American Lager', ml: 350, abv: 5.0 },
  { marca: 'Budweiser', tipo: 'American Lager', ml: 473, abv: 5.0 },
  { marca: 'Budweiser', tipo: 'American Lager', ml: 550, abv: 5.0 },
  
  // Heineken
  { marca: 'Heineken', tipo: 'Lager', ml: 250, abv: 5.0 },
  { marca: 'Heineken', tipo: 'Lager', ml: 330, abv: 5.0 },
  { marca: 'Heineken', tipo: 'Lager', ml: 473, abv: 5.0 },
  { marca: 'Heineken', tipo: 'Lager', ml: 600, abv: 5.0 },
  
  // Stella Artois
  { marca: 'Stella Artois', tipo: 'Lager', ml: 269, abv: 5.0 },
  { marca: 'Stella Artois', tipo: 'Lager', ml: 330, abv: 5.0 },
  { marca: 'Stella Artois', tipo: 'Lager', ml: 473, abv: 5.0 },
  { marca: 'Stella Artois', tipo: 'Lager', ml: 550, abv: 5.0 },
  
  // Corona
  { marca: 'Corona Extra', tipo: 'Lager', ml: 330, abv: 4.5 },
  { marca: 'Corona Extra', tipo: 'Lager', ml: 355, abv: 4.5 },
  { marca: 'Corona Extra', tipo: 'Lager', ml: 473, abv: 4.5 },
  
  // Original
  { marca: 'Original', tipo: 'Pilsen', ml: 269, abv: 4.7 },
  { marca: 'Original', tipo: 'Pilsen', ml: 350, abv: 4.7 },
  { marca: 'Original', tipo: 'Pilsen', ml: 473, abv: 4.7 },
  { marca: 'Original', tipo: 'Pilsen', ml: 600, abv: 4.7 },
  
  // Bohemia
  { marca: 'Bohemia Pilsen', tipo: 'Pilsen', ml: 350, abv: 5.0 },
  { marca: 'Bohemia Weiss', tipo: 'Weiss', ml: 350, abv: 5.0 },
  { marca: 'Bohemia IPA', tipo: 'IPA', ml: 350, abv: 5.5 },
  { marca: 'Bohemia Puro Malte', tipo: 'Lager', ml: 350, abv: 5.0 },
  
  // Itaipava
  { marca: 'Itaipava', tipo: 'Pilsen', ml: 269, abv: 4.5 },
  { marca: 'Itaipava', tipo: 'Pilsen', ml: 350, abv: 4.5 },
  { marca: 'Itaipava', tipo: 'Pilsen', ml: 473, abv: 4.5 },
  { marca: 'Itaipava', tipo: 'Pilsen', ml: 600, abv: 4.5 },
  
  // Polar
  { marca: 'Polar', tipo: 'Pilsen', ml: 269, abv: 4.7 },
  { marca: 'Polar', tipo: 'Pilsen', ml: 350, abv: 4.7 },
  { marca: 'Polar', tipo: 'Pilsen', ml: 473, abv: 4.7 },
  { marca: 'Polar', tipo: 'Pilsen', ml: 600, abv: 4.7 },
  
  // Cervejas Artesanais
  { marca: 'Colorado Appia', tipo: 'Witbier', ml: 350, abv: 5.5 },
  { marca: 'Colorado Indica', tipo: 'IPA', ml: 350, abv: 7.0 },
  { marca: 'Colorado Ribeirão Lager', tipo: 'Lager', ml: 350, abv: 4.8 },
  { marca: 'Colorado Demoiselle', tipo: 'Belgian Ale', ml: 350, abv: 6.3 },
  
  { marca: 'Eisenbahn Pilsen', tipo: 'Pilsen', ml: 350, abv: 4.8 },
  { marca: 'Eisenbahn Pale Ale', tipo: 'Pale Ale', ml: 350, abv: 5.4 },
  { marca: 'Eisenbahn Weizenbier', tipo: 'Weiss', ml: 350, abv: 4.8 },
  { marca: 'Eisenbahn Dunkel', tipo: 'Dark Lager', ml: 350, abv: 4.8 },
  
  { marca: 'Baden Baden Golden', tipo: 'Lager', ml: 350, abv: 4.7 },
  { marca: 'Baden Baden Cristal', tipo: 'Pilsen', ml: 350, abv: 4.8 },
  { marca: 'Baden Baden Red Ale', tipo: 'Red Ale', ml: 350, abv: 5.5 },
  { marca: 'Baden Baden Stout', tipo: 'Stout', ml: 350, abv: 6.5 },
  
  { marca: 'Petra Puro Malte', tipo: 'Lager', ml: 350, abv: 4.8 },
  { marca: 'Petra Aurum', tipo: 'Lager', ml: 350, abv: 5.0 },
  
  { marca: 'Patagonia Amber Lager', tipo: 'Amber Lager', ml: 473, abv: 5.0 },
  { marca: 'Patagonia Bohemian Pilsener', tipo: 'Pilsen', ml: 473, abv: 5.0 },
  { marca: 'Patagonia Weisse', tipo: 'Weiss', ml: 473, abv: 5.0 },
];

// Estabelecimentos reais e fictícios baseados em Santa Cruz do Sul
const ESTABELECIMENTOS = [
  // Centro
  { nome: 'Bar do Alemão', tipo: 'bar', bairro: 'Centro', cnpj: '12345678000101', tel: '(51) 3715-1001', rua: 'Rua Marechal Deodoro', num: '123' },
  { nome: 'Empório São José', tipo: 'mercado', bairro: 'Centro', cnpj: '12345678000102', tel: '(51) 3715-1002', rua: 'Rua 7 de Setembro', num: '456' },
  { nome: 'Distribuidora Central', tipo: 'distribuidora', bairro: 'Centro', cnpj: '12345678000103', tel: '(51) 3715-1003', rua: 'Av. Independência', num: '789' },
  { nome: 'Bar e Lancheria Martinez', tipo: 'bar', bairro: 'Centro', cnpj: '12345678000104', tel: '(51) 3715-1004', rua: 'Rua Ramiro Barcelos', num: '234' },
  { nome: 'Supermercado Bom Preço', tipo: 'mercado', bairro: 'Centro', cnpj: '12345678000105', tel: '(51) 3715-1005', rua: 'Rua Benjamin Constant', num: '567' },
  
  // Arroio Grande
  { nome: 'Bar do Gaúcho', tipo: 'bar', bairro: 'Arroio Grande', cnpj: '12345678000106', tel: '(51) 3715-1006', rua: 'Rua Arroio Grande', num: '890' },
  { nome: 'Mercado Família', tipo: 'mercado', bairro: 'Arroio Grande', cnpj: '12345678000107', tel: '(51) 3715-1007', rua: 'Rua dos Pinheiros', num: '123' },
  { nome: 'Choperia Schornstein', tipo: 'bar', bairro: 'Arroio Grande', cnpj: '12345678000108', tel: '(51) 3715-1008', rua: 'Av. Arroio Grande', num: '456' },
  
  // Bom Jesus
  { nome: 'Bar e Restaurante Tradição', tipo: 'bar', bairro: 'Bom Jesus', cnpj: '12345678000109', tel: '(51) 3715-1009', rua: 'Rua Bom Jesus', num: '789' },
  { nome: 'Minimercado do Bairro', tipo: 'mercado', bairro: 'Bom Jesus', cnpj: '12345678000110', tel: '(51) 3715-1010', rua: 'Rua São Pedro', num: '234' },
  { nome: 'Adega Santa Cruz', tipo: 'distribuidora', bairro: 'Bom Jesus', cnpj: '12345678000111', tel: '(51) 3715-1011', rua: 'Rua Bom Retiro', num: '567' },
  
  // Goiás
  { nome: 'Bar do Tche', tipo: 'bar', bairro: 'Goiás', cnpj: '12345678000112', tel: '(51) 3715-1012', rua: 'Rua Goiás', num: '890' },
  { nome: 'Mercadinho Econômico', tipo: 'mercado', bairro: 'Goiás', cnpj: '12345678000113', tel: '(51) 3715-1013', rua: 'Rua Mato Grosso', num: '123' },
  
  // Higienópolis
  { nome: 'Petiscaria Higienópolis', tipo: 'bar', bairro: 'Higienópolis', cnpj: '12345678000114', tel: '(51) 3715-1014', rua: 'Av. Higienópolis', num: '456' },
  { nome: 'Supermercado União', tipo: 'mercado', bairro: 'Higienópolis', cnpj: '12345678000115', tel: '(51) 3715-1015', rua: 'Rua das Flores', num: '789' },
  { nome: 'Distribuidora Gelada', tipo: 'distribuidora', bairro: 'Higienópolis', cnpj: '12345678000116', tel: '(51) 3715-1016', rua: 'Rua Dr. João Pessoa', num: '234' },
  
  // Menino Deus
  { nome: 'Bar e Bilhar Estrela', tipo: 'bar', bairro: 'Menino Deus', cnpj: '12345678000117', tel: '(51) 3715-1017', rua: 'Rua Menino Deus', num: '567' },
  { nome: 'Mercado Vizinho', tipo: 'mercado', bairro: 'Menino Deus', cnpj: '12345678000118', tel: '(51) 3715-1018', rua: 'Rua Santa Teresinha', num: '890' },
  
  // Santo Inácio
  { nome: 'Boteco da Esquina', tipo: 'bar', bairro: 'Santo Inácio', cnpj: '12345678000119', tel: '(51) 3715-1019', rua: 'Rua Santo Inácio', num: '123' },
  { nome: 'Supermercado Lider', tipo: 'mercado', bairro: 'Santo Inácio', cnpj: '12345678000120', tel: '(51) 3715-1020', rua: 'Av. Santo Inácio', num: '456' },
  { nome: 'Cervejaria e Distribuidora RS', tipo: 'distribuidora', bairro: 'Santo Inácio', cnpj: '12345678000121', tel: '(51) 3715-1021', rua: 'Rua Industrial', num: '789' },
  
  // Universitário
  { nome: 'Bar Universitário', tipo: 'bar', bairro: 'Universitário', cnpj: '12345678000122', tel: '(51) 3715-1022', rua: 'Av. Universitária', num: '234' },
  { nome: 'Choperia Campus', tipo: 'bar', bairro: 'Universitário', cnpj: '12345678000123', tel: '(51) 3715-1023', rua: 'Rua dos Estudantes', num: '567' },
  { nome: 'Minimercado Universitário', tipo: 'mercado', bairro: 'Universitário', cnpj: '12345678000124', tel: '(51) 3715-1024', rua: 'Rua UNISC', num: '890' },
  
  // Várzea
  { nome: 'Bar da Várzea', tipo: 'bar', bairro: 'Várzea', cnpj: '12345678000125', tel: '(51) 3715-1025', rua: 'Rua Várzea', num: '123' },
  { nome: 'Mercadinho Popular', tipo: 'mercado', bairro: 'Várzea', cnpj: '12345678000126', tel: '(51) 3715-1026', rua: 'Rua do Comércio', num: '456' },
  
  // Linha Santa Cruz
  { nome: 'Bar e Restaurante Colônia', tipo: 'bar', bairro: 'Linha Santa Cruz', cnpj: '12345678000127', tel: '(51) 3715-1027', rua: 'Linha Santa Cruz', num: '789' },
  { nome: 'Mercearia Colonial', tipo: 'mercado', bairro: 'Linha Santa Cruz', cnpj: '12345678000128', tel: '(51) 3715-1028', rua: 'Estrada Linha Santa Cruz', num: '234' },
  
  // Esmeralda
  { nome: 'Choperia Esmeralda', tipo: 'bar', bairro: 'Esmeralda', cnpj: '12345678000129', tel: '(51) 3715-1029', rua: 'Av. Esmeralda', num: '567' },
  { nome: 'Supermercado Bairro', tipo: 'mercado', bairro: 'Esmeralda', cnpj: '12345678000130', tel: '(51) 3715-1030', rua: 'Rua Esmeralda', num: '890' },
  { nome: 'Distribuidora Bebidas Sul', tipo: 'distribuidora', bairro: 'Esmeralda', cnpj: '12345678000131', tel: '(51) 3715-1031', rua: 'Rua Industrial II', num: '123' },
  
  // Senai
  { nome: 'Bar do SENAI', tipo: 'bar', bairro: 'Senai', cnpj: '12345678000132', tel: '(51) 3715-1032', rua: 'Av. SENAI', num: '456' },
  { nome: 'Mercado Cidade', tipo: 'mercado', bairro: 'Senai', cnpj: '12345678000133', tel: '(51) 3715-1033', rua: 'Rua dos Trabalhadores', num: '789' },
];

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed do banco de dados - SANTA CRUZ DO SUL...');

  // Limpar dados existentes
  console.log('🗑️  Limpando dados existentes...');
  await prisma.ad.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();

  // Criar usuários
  console.log('👥 Criando usuários...');
  const hashedPassword = await bcrypt.hash('123456', 10);

  // Cliente teste
  const clientUser = await prisma.user.create({
    data: {
      name: 'Cliente Santa Cruz',
      email: 'cliente@test.com',
      passwordHash: hashedPassword,
      role: 'CLIENT',
      isAdultConfirmed: true,
      emailVerified: true,
    },
  });

  // Criar vendedores e estabelecimentos
  console.log('🏪 Criando estabelecimentos em Santa Cruz do Sul...');
  const vendors: any[] = [];
  let userCounter = 1;

  for (const estab of ESTABELECIMENTOS) {
    const bairroInfo = BAIRROS.find(b => b.nome === estab.bairro)!;
    
    // Adicionar variação nas coordenadas para distribuir no bairro
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;

    // Criar usuário vendedor
    const vendorUser = await prisma.user.create({
      data: {
        name: `Proprietário ${estab.nome}`,
        email: `vendedor${userCounter}@${estab.nome.toLowerCase().replace(/\s+/g, '')}.com`,
        passwordHash: hashedPassword,
        role: 'VENDOR',
        isAdultConfirmed: true,
        emailVerified: true,
      },
    });

    // Criar estabelecimento
    const vendor = await prisma.vendor.create({
      data: {
        userId: vendorUser.id,
        companyName: estab.nome,
        cnpj: estab.cnpj,
        type: estab.tipo,
        latitude: bairroInfo.lat + latOffset,
        longitude: bairroInfo.lng + lngOffset,
        addressStreet: `${estab.rua}, ${estab.bairro}`,
        addressNumber: estab.num,
        addressCity: 'Santa Cruz do Sul',
        addressState: 'RS',
        addressZip: '96810-000',
        phone: estab.tel,
        isVerified: true,
      },
    });

    vendors.push(vendor);
    userCounter++;
  }

  // Criar produtos (cervejas) para cada estabelecimento
  console.log('🍺 Criando produtos (cervejas)...');
  let productCounter = 0;

  for (const vendor of vendors) {
    // Cada estabelecimento tem entre 15 e 35 cervejas diferentes
    const numProdutos = Math.floor(Math.random() * 21) + 15;
    const cervejasEscolhidas = CERVEJAS.sort(() => 0.5 - Math.random()).slice(0, numProdutos);

    for (const cerveja of cervejasEscolhidas) {
      // Preço base varia por volume e tipo de estabelecimento
      let precoBase = 0;
      
      if (cerveja.ml <= 350) {
        precoBase = 3.50 + Math.random() * 2.50;
      } else if (cerveja.ml <= 473) {
        precoBase = 5.00 + Math.random() * 3.00;
      } else if (cerveja.ml <= 600) {
        precoBase = 6.50 + Math.random() * 3.50;
      } else {
        precoBase = 9.00 + Math.random() * 5.00;
      }

      // Ajuste de preço por tipo de estabelecimento
      if (vendor.type === 'bar') {
        precoBase *= 1.3; // Bares são mais caros
      } else if (vendor.type === 'distribuidora') {
        precoBase *= 0.85; // Distribuidoras mais baratas
      }

      // Cervejas premium/importadas mais caras
      if (['Heineken', 'Stella Artois', 'Corona Extra', 'Budweiser'].includes(cerveja.marca)) {
        precoBase *= 1.4;
      }

      // Cervejas artesanais ainda mais caras
      if (['Colorado', 'Eisenbahn', 'Baden Baden', 'Patagonia'].some(m => cerveja.marca.includes(m))) {
        precoBase *= 1.6;
      }

      await prisma.product.create({
        data: {
          vendorId: vendor.id,
          brand: cerveja.marca,
          volume: cerveja.ml,
          price: parseFloat(precoBase.toFixed(2)),
          stockQuantity: Math.floor(Math.random() * 100) + 10,
          isActive: Math.random() > 0.1, // 90% disponíveis
          description: `${cerveja.marca} - ${cerveja.tipo} - ${cerveja.ml}ml - ${cerveja.abv}% ABV`,
        },
      });

      productCounter++;
    }
  }

  // Criar alguns anúncios
  console.log('📢 Criando anúncios promocionais...');
  const vendorsParaAnuncio = vendors.slice(0, 8); // 8 anúncios

  for (const vendor of vendorsParaAnuncio) {
    // Pegar um produto aleatório do vendor
    const produtos = await prisma.product.findMany({
      where: { vendorId: vendor.id },
      take: 1,
    });

    if (produtos.length > 0) {
      await prisma.ad.create({
        data: {
          productId: produtos[0].id,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
          priority: Math.floor(Math.random() * 5) + 1,
          status: 'active',
          paymentStatus: 'paid',
        },
      });
    }
  }

  console.log('✅ Seed concluído!');
  console.log('\n📊 Dados criados:');
  console.log(`  • ${userCounter} usuários (1 cliente + ${userCounter - 1} vendedores)`);
  console.log(`  • ${vendors.length} estabelecimentos em Santa Cruz do Sul`);
  console.log(`  • ${productCounter} produtos (cervejas)`);
  console.log(`  • ${vendorsParaAnuncio.length} anúncios promocionais`);
  console.log('\n🏙️  Bairros cobertos:');
  BAIRROS.forEach(b => console.log(`  • ${b.nome}`));
  console.log('\n🔑 Credencial de teste:');
  console.log(`  • Email: cliente@test.com | Senha: 123456`);
  console.log(`  • Email: vendedor1@bardoalemao.com | Senha: 123456`);
}

main()
  .catch((e) => {
    console.error('Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
