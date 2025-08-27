# 🧪 Guia de Testes Unitários - ClinicalCare

## 📋 Visão Geral

Este documento explica como implementar e executar testes unitários no projeto ClinicalCare usando **Jest** e **TypeScript**.

## 🎯 O que são Testes Unitários?

Testes unitários verificam se uma **unidade específica de código** (função, método, classe) funciona corretamente de forma **isolada**. No ClinicalCare, testamos:

- ✅ **Services** - Lógica de negócio
- ✅ **Controllers** - Manipulação de requisições HTTP  
- ✅ **Middlewares** - Validação e autenticação
- ✅ **Utilitários** - Funções auxiliares
- ✅ **Models** - Interação com banco de dados

## 🚀 Benefícios dos Testes Unitários

### 🔍 **Detecção Rápida de Bugs**
```typescript
// Teste detecta erro imediatamente
it('deve validar CPF corretamente', () => {
  expect(validateCPF('123.456.789-10')).toBe(false); // ❌ CPF inválido
  expect(validateCPF('123.456.789-09')).toBe(true);  // ✅ CPF válido
});
```

### 🔄 **Refatoração Segura**
```typescript
// Antes de refatorar, testes garantem que funcionalidade continua
it('deve criar usuário com dados válidos', async () => {
  const result = await userService.create(validUserData);
  expect(result).toHaveProperty('id');
  expect(result.name).toBe('João Silva');
});
```

### 📚 **Documentação Viva**
```typescript
// Testes mostram como usar as funções
it('deve autenticar com token válido', () => {
  const token = 'Bearer valid-jwt-token';
  const result = authenticateToken(token);
  expect(result.user).toBeDefined();
});
```

## 🛠️ Estrutura de Testes

```
src/
├── __tests__/                    # Pasta principal de testes
│   ├── setup.ts                  # Configuração global
│   ├── services/                 # Testes de services
│   │   ├── userService.test.ts
│   │   ├── patientService.test.ts
│   │   └── attendanceService.test.ts
│   ├── middlewares/              # Testes de middlewares
│   │   ├── auth.test.ts
│   │   └── validation.test.ts
│   ├── controllers/              # Testes de controllers
│   │   ├── userController.test.ts
│   │   └── patientController.test.ts
│   └── utils/                    # Testes de utilitários
│       └── validation.test.ts
├── services/                     # Código fonte
├── controllers/
└── middlewares/
```

## 🧪 Padrão AAA (Arrange, Act, Assert)

### **Arrange** - Preparar dados
```typescript
const mockUser = {
  id: 1,
  name: 'João Silva',
  email: 'joao@test.com'
};
(User.findByPk as jest.Mock).mockResolvedValue(mockUser);
```

### **Act** - Executar ação
```typescript
const result = await userService.find(1);
```

### **Assert** - Verificar resultado
```typescript
expect(result).toEqual(mockUser);
expect(User.findByPk).toHaveBeenCalledWith(1);
```

## 📝 Exemplos de Testes

### 1. **Teste de Service**
```typescript
describe('UserService', () => {
  it('deve retornar usuário quando encontrado', async () => {
    // Arrange
    const userId = 1;
    (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

    // Act
    const result = await userService.find(userId);

    // Assert
    expect(result).toEqual(mockUser);
  });
});
```

### 2. **Teste de Middleware**
```typescript
describe('authenticateToken', () => {
  it('deve autenticar com token válido', () => {
    // Arrange
    mockRequest.headers = { authorization: 'Bearer valid-token' };
    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    // Act
    authenticateToken(mockRequest, mockResponse, mockNext);

    // Assert
    expect(mockRequest.user).toEqual(mockUser);
    expect(mockNext).toHaveBeenCalled();
  });
});
```

### 3. **Teste de Validação**
```typescript
describe('validateCPF', () => {
  it('deve validar CPF válido', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
  });

  it('deve rejeitar CPF inválido', () => {
    expect(validateCPF('123.456.789-10')).toBe(false);
  });
});
```

## 🚀 Como Executar Testes

### **Executar todos os testes**
```bash
npm test
```

### **Executar em modo watch (desenvolvimento)**
```bash
npm run test:watch
```

### **Executar com cobertura**
```bash
npm run test:coverage
```

### **Executar teste específico**
```bash
npm test -- userService.test.ts
```

### **Executar com verbose**
```bash
npm run test:verbose
```

## 📊 Cobertura de Testes

O Jest gera relatórios de cobertura mostrando:

- **Statements**: Porcentagem de linhas executadas
- **Branches**: Porcentagem de branches (if/else) testados
- **Functions**: Porcentagem de funções chamadas
- **Lines**: Porcentagem de linhas cobertas

### **Relatório de Cobertura**
```
----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |   85.71 |    80.00 |   83.33 |   85.71 |                 
 user.ts  |   85.71 |    80.00 |   83.33 |   85.71 | 15,23,45         
----------|---------|----------|---------|---------|-------------------
```

## 🔧 Configuração do Jest

### **jest.config.js**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts'
  ],
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
};
```

## 🎯 Boas Práticas

### ✅ **Nomes Descritivos**
```typescript
// ❌ Ruim
it('should work', () => {});

// ✅ Bom
it('deve retornar erro 404 quando usuário não encontrado', () => {});
```

### ✅ **Testes Isolados**
```typescript
// Cada teste deve ser independente
beforeEach(() => {
  jest.clearAllMocks(); // Limpa mocks
});

afterEach(() => {
  // Cleanup após cada teste
});
```

### ✅ **Mocks Apropriados**
```typescript
// Mock de dependências externas
jest.mock('../../models/user');
jest.mock('jsonwebtoken');
jest.mock('bcrypt');
```

### ✅ **Testes de Casos Extremos**
```typescript
it('deve lidar com dados vazios', () => {});
it('deve lidar com erros de database', () => {});
it('deve validar entrada inválida', () => {});
```

## 🚧 Próximos Passos

### **Testes de Integração**
- Testar APIs completas
- Testar interação com banco de dados
- Testar fluxos completos

### **Testes E2E**
- Testar interface do usuário
- Testar fluxos completos da aplicação
- Usar Cypress ou Playwright

### **Testes de Performance**
- Testar tempo de resposta
- Testar uso de memória
- Testar carga

## 📚 Recursos Adicionais

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)

---

**🧪 Lembre-se**: Testes unitários são investimento no futuro do código. Eles garantem qualidade, facilitam manutenção e aumentam a confiança nas mudanças.
