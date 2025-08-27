# 🧪 Configuração dos Testes - ClinicalCare

## 📋 Pré-requisitos

Antes de executar os testes, você precisa instalar as dependências:

### **1. Instalar Dependências**
```bash
cd backend
npm install
```

### **2. Verificar Instalação**
```bash
# Verificar se o Jest foi instalado
npm list jest

# Verificar se ts-jest foi instalado
npm list ts-jest
```

## 🚀 Executando os Testes

### **Primeira Execução**
```bash
# Executar todos os testes
npm test
```

### **Modo Desenvolvimento (Recomendado)**
```bash
# Executar em modo watch (recomendado)
npm run test:watch
```

### **Com Relatório de Cobertura**
```bash
# Executar com cobertura
npm run test:coverage
```

### **Com Verbose (Mais Detalhes)**
```bash
# Executar com verbose
npm run test:verbose
```

## 📁 Estrutura dos Testes

```
backend/
├── jest.config.js                    # Configuração do Jest
├── src/
│   ├── __tests__/                    # Pasta principal de testes
│   │   ├── setup.ts                  # Configuração global
│   │   ├── services/                 # Testes de services
│   │   │   └── userService.test.ts   # Testes do UserService
│   │   ├── middlewares/              # Testes de middlewares
│   │   │   └── auth.test.ts          # Testes de autenticação
│   │   └── utils/                    # Testes de utilitários
│   │       └── validation.test.ts    # Testes de validação
│   ├── services/                     # Código fonte
│   ├── middlewares/
│   └── utils/
└── TESTING.md                        # Documentação completa
```

## 🔧 Configuração

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
    '!src/server.ts',
    '!src/config/database.ts'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
```

### **tsconfig.json**
```json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

## 📊 Exemplo de Saída

### **Execução Normal**
```bash
$ npm test

 PASS  src/__tests__/utils/validation.test.ts
  Validation Utils
    validateCPF
      ✓ deve validar CPF válido
      ✓ deve rejeitar CPF inválido
      ✓ deve aceitar CPF com ou sem formatação
    validateEmail
      ✓ deve validar emails válidos
      ✓ deve rejeitar emails inválidos
    validatePhone
      ✓ deve validar telefones válidos
      ✓ deve rejeitar telefones inválidos
      ✓ deve aceitar telefone com ou sem formatação

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        2.145 s
```

### **Com Cobertura**
```bash
$ npm run test:coverage

----------|---------|----------|---------|---------|-------------------
File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------|---------|----------|---------|---------|-------------------
All files |   85.71 |    80.00 |   83.33 |   85.71 |                 
 utils.ts |   85.71 |    80.00 |   83.33 |   85.71 | 15,23,45         
----------|---------|----------|---------|---------|-------------------
```

## 🐛 Solução de Problemas

### **Erro: "Cannot find name 'describe'/'it'/'expect'"**
```bash
# Instalar tipos do Jest
npm install --save-dev @types/jest

# Verificar se está no tsconfig.json
{
  "compilerOptions": {
    "types": ["jest", "node"]
  }
}
```

### **Erro: "Jest did not exit"**
```bash
# Adicionar no jest.config.js
module.exports = {
  // ... outras configs
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts']
};
```

### **Erro: "Cannot resolve module"**
```bash
# Verificar se o arquivo existe
# Verificar se o import está correto
# Verificar se o moduleNameMapping está configurado
```

## 🎯 Próximos Passos

1. **Executar os testes existentes**
   ```bash
   npm test
   ```

2. **Adicionar mais testes**
   - Testes para outros services
   - Testes para controllers
   - Testes para middlewares

3. **Configurar CI/CD**
   - Executar testes automaticamente
   - Relatórios de cobertura
   - Qualidade do código

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**🧪 Dica**: Use `npm run test:watch` durante o desenvolvimento para executar testes automaticamente quando salvar arquivos!
