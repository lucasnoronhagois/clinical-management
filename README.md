# Clinical Management System

Sistema de gerenciamento clínico desenvolvido com **TypeScript**, React (Frontend) e Node.js/Express (Backend).

## 🚀 Migração para TypeScript

Este projeto foi migrado para TypeScript para oferecer:

- **Type Safety**: Detecção de erros em tempo de compilação
- **Melhor IntelliSense**: Autocompletar mais preciso
- **Refatoração Segura**: Mudanças de código mais seguras
- **Documentação Viva**: Tipos servem como documentação
- **Melhor Manutenibilidade**: Código mais legívéis e organizados

## 📁 Estrutura do Projeto

```
clinical-management/
├── backend/                 # API Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/         # Configurações do banco e rotas
│   │   ├── controllers/    # Controladores da API
│   │   ├── middlewares/    # Middlewares de autenticação e validação
│   │   ├── models/         # Modelos Sequelize com TypeScript
│   │   ├── routes/         # Rotas da API
│   │   ├── services/       # Lógica de negócio
│   │   ├── schema/         # Schemas de validação Yup
│   │   └── utils/          # Utilitários
│   ├── tsconfig.json       # Configuração TypeScript
│   └── package.json
├── frontend/               # Aplicação React + TypeScript
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── types/          # Definições de tipos TypeScript
│   │   └── utils/          # Utilitários
│   ├── tsconfig.json       # Configuração TypeScript
│   └── package.json
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** + **Express**
- **TypeScript**
- **Sequelize** (ORM)
- **MySQL** (Banco de dados)
- **JWT** (Autenticação)
- **Yup** (Validação de dados)
- **bcrypt** (Criptografia de senhas)
- **CORS**

### Frontend
- **React 19**
- **TypeScript**
- **React Router DOM**
- **React Bootstrap**
- **Axios** (HTTP Client)
- **Vite** (Build Tool)

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 18 ou superior)
- MySQL
- npm ou yarn

### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará rodando em `http://localhost:5173`

## 📝 Scripts Disponíveis

### Backend
- `npm run dev`: Executa o servidor em modo desenvolvimento com hot reload
- `npm run build`: Compila o TypeScript para JavaScript
- `npm run build:secure`: Compila, minifica e obfusca o código para produção
- `npm start`: Executa o servidor compilado

### Frontend
- `npm run dev`: Executa o servidor de desenvolvimento
- `npm run build`: Compila o projeto para produção
- `npm run lint`: Executa o linter TypeScript/ESLint

## 🔧 Configuração do TypeScript

### Backend
- **Target**: ES2020
- **Module**: CommonJS
- **Strict Mode**: Habilitado
- **Decorators**: Habilitados (para Sequelize)

### Frontend
- **Target**: ES2020
- **Module**: ESNext
- **JSX**: React-JSX
- **Strict Mode**: Habilitado

## 🔐 Autenticação e Segurança

- **JWT**: Autenticação baseada em tokens
- **bcrypt**: Criptografia de senhas
- **Middleware de Autenticação**: Proteção de rotas
- **Validação Yup**: Validação de dados em todas as rotas
- **Minificação**: Código otimizado para produção
- **Obfuscação**: Proteção contra engenharia reversa
- **Logs Condicionais**: Logs apenas em desenvolvimento

## 🛡️ Build Seguro para Produção

### **npm run build:secure**
Este comando executa um processo completo de proteção do código:

1. **Compilação TypeScript** → JavaScript
2. **Minificação** → Reduz tamanho do código
3. **Obfuscação** → Protege contra engenharia reversa

### **Resultado:**
- ✅ **41 arquivos** processados
- ✅ **Código otimizado** para produção
- ✅ **Proteção completa** contra análise de código
- ✅ **Logs removidos** automaticamente

## 📊 Funcionalidades Implementadas

### ✅ Backend (100% TypeScript)
- **Autenticação**: Login, registro, alteração de senha, reset de senha
- **Usuários**: CRUD completo com validação
- **Empresas**: CRUD completo com validação
- **Pacientes**: CRUD completo com validação
- **Locais**: CRUD completo com validação
- **Atendimentos**: CRUD completo com validação
- **Dashboard**: Estatísticas em tempo real
- **Relatórios**: Relatórios de atendimentos por profissional

### ✅ Frontend (100% TypeScript)
- **Autenticação**: Login e logout
- **Seleção de Empresa**: Interface para escolher empresa
- **Dashboard**: Visualização de estatísticas
- **Gestão de Pacientes**: CRUD completo
- **Gestão de Atendimentos**: CRUD completo
- **Gestão de Usuários**: CRUD completo (apenas admins)
- **Gestão de Empresas**: CRUD completo (apenas admins)
- **Gestão de Locais**: CRUD completo
- **Relatórios**: Visualização de relatórios

### ✅ Validação Yup (100% Implementada)
- **loginSchema**: Validação de login
- **userSchema**: Validação de usuários
- **changePasswordSchema**: Validação de alteração de senha
- **resetPasswordSchema**: Validação de reset de senha
- **patientSchema**: Validação de pacientes
- **companySchema**: Validação de empresas
- **placeSchema**: Validação de locais
- **attendanceSchema**: Validação de atendimentos

## 🔄 Rotas da API

### Autenticação (`/api/auth`)
- `POST /login` - Login de usuário
- `POST /register` - Registro de usuário (admin)
- `POST /change-password` - Alterar senha
- `POST /reset-password` - Reset de senha

### Usuários (`/api/users`)
- `GET /` - Listar usuários
- `GET /:id` - Buscar usuário
- `POST /` - Criar usuário
- `PUT /:id` - Atualizar usuário
- `DELETE /:id` - Deletar usuário

### Empresas (`/api/companies`)
- `GET /` - Listar empresas
- `GET /:id` - Buscar empresa
- `POST /` - Criar empresa
- `PUT /:id` - Atualizar empresa
- `DELETE /:id` - Deletar empresa

### Pacientes (`/api/patients`)
- `GET /` - Listar pacientes
- `GET /:id` - Buscar paciente
- `POST /` - Criar paciente
- `PUT /:id` - Atualizar paciente
- `DELETE /:id` - Deletar paciente

### Locais (`/api/places`)
- `GET /` - Listar locais
- `GET /:id` - Buscar local
- `POST /` - Criar local
- `PUT /:id` - Atualizar local
- `DELETE /:id` - Deletar local

### Atendimentos (`/api/attendances`)
- `GET /` - Listar atendimentos
- `GET /:id` - Buscar atendimento
- `POST /` - Criar atendimento
- `PUT /:id` - Atualizar atendimento
- `PUT /:id/confirm` - Confirmar atendimento
- `PUT /:id/finish` - Finalizar atendimento
- `DELETE /:id` - Deletar atendimento

### Dashboard (`/api/dashboard`)
- `GET /statistics` - Estatísticas do dashboard

### Relatórios (`/api/reports`)
- `GET /attendances` - Relatório de atendimentos por profissional

## 📊 Benefícios da Migração

1. **Detecção de Erros**: Erros são encontrados durante a compilação
2. **Autocompletar**: Melhor suporte do IDE
3. **Refatoração**: Mudanças seguras em todo o código
4. **Documentação**: Tipos servem como documentação viva
5. **Manutenibilidade**: Código mais legível e organizado
6. **Validação Robusta**: Todos os dados são validados com Yup
7. **Type Safety**: Prevenção de erros em tempo de execução

## 🔄 Status do Projeto

### ✅ Concluído
- [x] Migração completa para TypeScript
- [x] Validação Yup em todas as rotas
- [x] Autenticação JWT implementada
- [x] CRUD completo para todas as entidades
- [x] Dashboard funcional
- [x] Sistema de relatórios
- [x] Interface responsiva
- [x] Middlewares de segurança
- [x] Minificação e obfuscação do código
- [x] Logs condicionais por ambiente

### 🚧 Próximos Passos
- [ ] Testes unitários com Jest
- [ ] Testes de integração
- [ ] Documentação da API com Swagger
- [ ] Cache com Redis
- [ ] Monitoramento de performance
- [ ] Deploy automatizado

## 📄 Licença

Este projeto está sob a licença ISC.
