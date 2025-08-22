# Backend - Arquitetura em Camadas (Implementação Completa)

Este projeto foi completamente refatorado para seguir uma arquitetura em camadas (Layered Architecture) seguindo o padrão MVC com uma camada adicional de Services.

## 📁 Estrutura de Pastas

```
backend/
├── controllers/          # Controladores (lógica HTTP)
│   ├── index.js         # Centralizador de controllers
│   ├── userController.js
│   ├── patientController.js
│   ├── companyController.js
│   ├── placeController.js
│   ├── attendanceController.js
│   ├── dashboardController.js
│   ├── reportController.js
│   └── authController.js
├── services/            # Serviços (lógica de negócio)
│   ├── userService.js
│   ├── patientService.js
│   ├── companyService.js
│   ├── placeService.js
│   ├── attendanceService.js
│   ├── dashboardService.js
│   ├── reportService.js
│   └── authService.js
├── routes/              # Rotas HTTP
│   ├── index.js         # Configuração central de rotas
│   ├── users/
│   ├── patients/
│   ├── companies/
│   ├── places/
│   ├── attendances/
│   ├── dashboard.js
│   └── reports.js
├── models/              # Modelos de dados
├── middlewares/         # Middlewares
└── server.js            # Configuração do servidor
```

## 🏗️ Arquitetura Implementada

### ✅ **ENTIDADES COMPLETAS (8/8)**

| **Entidade** | **Service** | **Controller** | **Routes** | **Status** |
|--------------|-------------|----------------|------------|------------|
| **Users** | ✅ `userService.js` | ✅ `userController.js` | ✅ Refatoradas | **COMPLETO** |
| **Patients** | ✅ `patientService.js` | ✅ `patientController.js` | ✅ Refatoradas | **COMPLETO** |
| **Companies** | ✅ `companyService.js` | ✅ `companyController.js` | ✅ Refatoradas | **COMPLETO** |
| **Places** | ✅ `placeService.js` | ✅ `placeController.js` | ✅ Refatoradas | **COMPLETO** |
| **Attendances** | ✅ `attendanceService.js` | ✅ `attendanceController.js` | ✅ Refatoradas | **COMPLETO** |
| **Dashboard** | ✅ `dashboardService.js` | ✅ `dashboardController.js` | ✅ Refatoradas | **COMPLETO** |
| **Reports** | ✅ `reportService.js` | ✅ `reportController.js` | ✅ Refatoradas | **COMPLETO** |
| **Auth** | ✅ `authService.js` | ✅ `authController.js` | ✅ Refatoradas | **COMPLETO** |

## 🔄 Fluxo de Dados

```
Request → Routes → Controllers → Services → Models → Database
Response ← Controllers ← Services ← Models ← Database
```

## 📝 Detalhes da Implementação

### 1. **Routes** (`/routes`)
- **Responsabilidade**: Apenas definição de endpoints HTTP
- **Padrão**: Todas as rotas usam `getInstances()` para obter controllers
- **Exemplo**:
```javascript
router.get('/:id', async (req, res) => {
  const { controllers } = getInstances(req);
  await controllers.UserController.find(req, res);
});
```

### 2. **Controllers** (`/controllers`)
- **Responsabilidade**: Gerenciar requisições HTTP e respostas
- **Padrão**: Tratamento de erros HTTP, formatação de resposta
- **Exemplo**:
```javascript
async find(req, res) {
  try {
    const user = await this.userService.find(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}
```

### 3. **Services** (`/services`)
- **Responsabilidade**: Lógica de negócio
- **Padrão**: Regras de negócio, validações, operações de dados
- **Exemplo**:
```javascript
async find(id) {
  const user = await this.User.findByPk(id);
  if (!user) {
    throw new Error('Usuário não encontrado.');
  }
  return user;
}
```

### 4. **Models** (`/models`)
- **Responsabilidade**: Acesso e manipulação de dados
- **Padrão**: Seguindo a estrutura do User (static load) e outros (sequelize.define)

## 🎯 Funcionalidades Implementadas

### **Users**
- ✅ CRUD completo
- ✅ Paginação
- ✅ Filtros por company_id, name, role
- ✅ Criptografia de senhas
- ✅ Validação de login único

### **Patients**
- ✅ CRUD completo
- ✅ Filtros por company_id
- ✅ Validação de campos obrigatórios
- ✅ Relacionamento com Company

### **Companies**
- ✅ CRUD completo
- ✅ Validação de endereço
- ✅ Soft delete

### **Places**
- ✅ CRUD completo
- ✅ Filtros por company_id
- ✅ Soft delete

### **Attendances**
- ✅ CRUD completo
- ✅ Relacionamentos complexos (Patient, User, Place)
- ✅ Lógica de receptionist_id
- ✅ Filtros por company_id

### **Dashboard**
- ✅ Estatísticas por período
- ✅ Validação de datas
- ✅ Atendimentos e pacientes por dia

### **Reports**
- ✅ Relatórios de atendimentos por profissional
- ✅ Agregações por DOCTOR e RECEPTIONIST
- ✅ Filtros por company_id e role

### **Auth**
- ✅ Login com email/login
- ✅ Registro de usuários
- ✅ Geração de JWT
- ✅ Validação de campos únicos

## 🔧 Middleware de Instâncias

Todas as rotas usam o middleware `getInstances()`:

```javascript
const getInstances = (req) => {
  const models = getModels(req.app.locals.sequelize);
  const controllers = getControllers(models);
  return { models, controllers };
};
```

## ✅ Benefícios Alcançados

### 1. **Separação de Responsabilidades**
- ✅ Cada camada tem responsabilidade específica
- ✅ Mudanças isoladas por camada

### 2. **Reutilização**
- ✅ Services podem ser usados por diferentes controllers
- ✅ Lógica de negócio centralizada

### 3. **Testabilidade**
- ✅ Cada camada pode ser testada independentemente
- ✅ Services podem ser testados sem HTTP

### 4. **Manutenibilidade**
- ✅ Código organizado e fácil de navegar
- ✅ Fácil de adicionar novos recursos

### 5. **Consistência**
- ✅ Padrão uniforme em todas as entidades
- ✅ Tratamento de erros padronizado

## 🚀 Como Adicionar Novas Entidades

### 1. Criar Service
```javascript
// services/novoService.js
export default class NovoService {
  constructor(models) {
    this.Novo = models.Novo;
  }
  
  async find(id) {
    // lógica de negócio
  }
}
```

### 2. Criar Controller
```javascript
// controllers/novoController.js
import NovoService from '../services/novoService.js';

export default class NovoController {
  constructor(models) {
    this.novoService = new NovoService(models);
  }
  
  async find(req, res) {
    // lógica HTTP
  }
}
```

### 3. Adicionar ao Index
```javascript
// controllers/index.js
import NovoController from './novoController.js';

export default function getControllers(models) {
  return {
    // ... outros controllers
    NovoController: new NovoController(models)
  };
}
```

### 4. Criar Rotas
```javascript
// routes/novo/novo.js
router.get('/:id', async (req, res) => {
  const { controllers } = getInstances(req);
  await controllers.NovoController.find(req, res);
});
```

## 📊 Comparação Antes vs Depois

| **Aspecto** | **Antes** | **Depois** |
|-------------|-----------|------------|
| **Estrutura** | Lógica misturada nas rotas | 4 camadas bem definidas |
| **Código** | 100+ linhas por rota | ~10 linhas por rota |
| **Manutenção** | Difícil de manter | Fácil e organizado |
| **Testes** | Difícil de testar | Cada camada testável |
| **Reutilização** | Código duplicado | Lógica centralizada |

## 🎯 Próximos Passos Sugeridos

1. **Implementar testes unitários** para services
2. **Adicionar validações mais robustas** com Joi ou Yup
3. **Implementar logging centralizado**
4. **Adicionar documentação da API** com Swagger
5. **Implementar cache** para consultas frequentes
6. **Adicionar rate limiting** para proteção da API

## 🏆 Resultado Final

✅ **Arquitetura completa implementada**
✅ **Todas as 8 entidades migradas**
✅ **Código limpo e organizado**
✅ **Separação clara de responsabilidades**
✅ **Fácil manutenção e escalabilidade**
✅ **Padrão consistente em todo o projeto** 