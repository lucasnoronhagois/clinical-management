import dotenv from 'dotenv';

// Carrega variáveis de ambiente para testes
dotenv.config({ path: '.env.test' });

// Configurações globais para testes
beforeAll(() => {
  // Setup global para todos os testes
  console.log('🧪 Iniciando testes...');
});

afterAll(() => {
  // Cleanup global após todos os testes
  console.log('✅ Testes finalizados');
});

// Mock do console.log para não poluir output dos testes
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
