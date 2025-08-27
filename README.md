# 🏥 ClinicalCare - Sistema de Gerenciamento de Consultas Médicas

## 📋 Descrição

**ClinicalCare** é um sistema abrangente de gerenciamento de consultas médicas desenvolvido com **TypeScript**, React (Frontend) e Node.js/Express (Backend), oferecendo uma solução robusta para clínicas e hospitais gerenciarem de forma eficiente e segura pacientes, consultas, usuários e relatórios.

## 🚀 Funcionalidades Principais

### 🔐 Sistema de Autenticação e Autorização
- **JWT (JSON Web Tokens)** para autenticação segura
- **Sistema baseado em roles** com diferentes níveis de acesso
- **Proteção de rotas** com middleware de autenticação
- **Validação de dados** com Yup Schema Validation
- **Criptografia de senhas** com bcrypt

### 🏢 Gestão Multi-Empresa
- **Suporte para múltiplas empresas** em uma única instância
- **Seleção de empresa** após login para usuários administradores
- **Isolamento de dados** por empresa
- **Gestão completa de informações empresariais**

### 👥 Gestão de Usuários
- **Registro e edição** de usuários do sistema
- **Diferentes perfis** (Administrador, Recepcionista, etc.)
- **Controle de acesso** baseado em roles
- **Gestão granular de permissões**

### 👨‍⚕️ Gestão de Pacientes
- **Registro completo de pacientes** com validações
- **Busca avançada e filtros**
- **Paginação** para melhor performance
- **Validação de CPF** e dados pessoais
- **Vinculação automática** à empresa selecionada

### 📍 Gestão de Locais
- **Registro de locais de atendimento**
- **Organização hierárquica** de espaços
- **Controle de disponibilidade** de locais

### 🏥 Gestão de Consultas
- **Agendamento de consultas**
- **Controle de status** (confirmado, pendente, finalizado)
- **Vinculação paciente-local-profissional**
- **Histórico completo de consultas**
- **Filtros avançados** por data, paciente, local

### 📊 Dashboard e Relatórios
- **Dashboard interativo** com estatísticas em tempo real
- **Filtros por período** (hoje, semana, mês, ano)
- **Gráficos de consultas e pacientes**
- **Relatórios personalizáveis**
- **Exportação de dados**

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

## 🧪 Testes Unitários

O projeto possui uma **solução completa de testes unitários** implementada com Jest e TypeScript, garantindo a qualidade e confiabilidade do código:

### ✅ Cobertura de Testes
- **8 Services testados** com 100% de cobertura
- **115 testes** implementados e funcionando
- **Métodos testados**: `find`, `list`, `create`, `update`, `delete`, `createMultiple`
- **Cenários específicos**: autenticação, validações, tratamento de erros

### 🎯 Services Testados
- **UserService** - Gestão de usuários
- **PatientService** - Gestão de pacientes  
- **CompanyService** - Gestão de empresas
- **PlaceService** - Gestão de locais
- **AttendanceService** - Gestão de consultas
- **AuthService** - Autenticação e autorização
- **DashboardService** - Estatísticas e relatórios
- **ReportService** - Geração de relatórios

### 🚀 Comandos de Teste
```bash
# Executar todos os testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Executar testes em modo watch
npm run test:watch

# Executar testes específicos
npm test -- --testPathPattern="userService"
```

### 📊 Benefícios dos Testes
- **Qualidade do Código**: Garantia de funcionamento correto
- **Refatoração Segura**: Mudanças com confiança
- **Documentação Viva**: Testes como documentação
- **Detecção de Bugs**: Identificação rápida de problemas
- **Desenvolvimento Confiável**: Base sólida para evolução

### 📚 Documentação Detalhada
- **[SETUP_TESTS.md](backend/SETUP_TESTS.md)**: Guia de configuração e execução
- **[TESTING.md](backend/TESTING.md)**: Documentação completa e conceitos

## 🗄️ Modelo de Dados

### Entidades Principais
- **Users**: Usuários do sistema com diferentes roles
- **Companies**: Empresas/clínicas registradas
- **Patients**: Pacientes vinculados às empresas
- **Places**: Locais de atendimento
- **Attendances**: Consultas e atendimentos
- **Reports**: Relatórios e estatísticas

### Relacionamentos
- Usuários podem pertencer a uma empresa
- Pacientes são vinculados a uma empresa
- Consultas conectam pacientes, locais e usuários
- Sistema de auditoria com timestamps

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

### Arquitetura
- **Arquitetura MVC** (Model-View-Controller)
- **Separação de responsabilidades** (Controllers, Services, Models)
- **Padrão de middleware** para autenticação e validação
- **API RESTful** com endpoints padronizados

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

## 🔧 Configuração de Ambiente

Para configurar as variáveis de ambiente, consulte o arquivo **[ENV.md](backend/ENV.md)** que contém todas as variáveis necessárias, incluindo:
- Configuração do banco de dados
- Chaves JWT
- URLs da aplicação (`backend_url`)
- Configurações de CORS
- Ambientes de desenvolvimento e produção

## 🚀 Como Usar

1. **Acesse a aplicação** em `http://localhost:5173`
2. **Faça login** com suas credenciais
3. **Selecione uma empresa** (se você for administrador)
4. **Navegue pelos módulos**:
   - Dashboard: Visualizar estatísticas
   - Pacientes: Gerenciar cadastros de pacientes
   - Consultas: Agendar e gerenciar consultas
   - Locais: Configurar locais de atendimento
   - Usuários: Gerenciar usuários do sistema
   - Relatórios: Acessar relatórios personalizados

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

## 🔒 Segurança

- **Autenticação JWT** com tokens seguros
- **Criptografia de senhas** com bcrypt
- **Validação de entrada** com schemas Yup
- **Proteção CORS** configurada
- **Middleware de autenticação** em todas as rotas protegidas
- **Sanitização de dados** de entrada
- **Minificação de código** para otimização de produção
- **Obfuscação de código** contra engenharia reversa
- **Logs condicionais** apenas em desenvolvimento

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

## 📈 Performance

- **Paginação** implementada em todas as listagens
- **Filtros otimizados** para busca eficiente
- **Carregamento lazy** de componentes
- **Compressão de resposta HTTP**
- **Cache de dados** frequentes

## 🧪 Testes

O projeto está preparado para implementação de testes:
- **Testes unitários** com Jest
- **Testes de integração** para APIs
- **Testes E2E** com Cypress (estrutura preparada)

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

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido para demonstrar habilidades de desenvolvimento full-stack com Node.js, React, TypeScript e MySQL.

## 📧 Contato

**lucas.noronha.gois@gmail.com**

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos canais disponíveis no perfil do desenvolvedor.

---

**📖 English Version**: [README_EN.md](README_EN.md)

**ClinicalCare** - Transformando o gerenciamento de consultas médicas com tecnologia moderna, TypeScript e eficiência.
