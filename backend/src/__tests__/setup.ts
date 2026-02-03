// Global test setup
beforeAll(() => {
  // Garante que estamos em ambiente de teste (apenas para testes de integração)
  if (process.env['DATABASE_URL'] && !process.env['DATABASE_URL'].includes('beeraqui_test')) {
    throw new Error('⚠️  PERIGO: Tentando rodar testes fora do banco de teste!');
  }
});
