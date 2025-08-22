# 🏥 ClinicalCare - Sistema de Gestão de Atendimentos Médicos

## 📋 Descrição

O **ClinicalCare** é um sistema completo de gestão de atendimentos médicos desenvolvido com arquitetura moderna, oferecendo uma solução robusta para clínicas e hospitais gerenciarem pacientes, atendimentos, usuários e relatórios de forma eficiente e segura.

## 🚀 Características Principais

### 🔐 Sistema de Autenticação e Autorização
- **JWT (JSON Web Tokens)** para autenticação segura
- **Sistema de roles** com diferentes níveis de acesso
- **Proteção de rotas** com middleware de autenticação
- **Validação de dados** com Yup Schema Validation
- **Criptografia de senhas** com bcrypt

### 🏢 Gestão Multi-Empresa
- **Suporte a múltiplas empresas** em uma única instância
- **Seleção de empresa** após login para usuários administradores
- **Isolamento de dados** por empresa
- **Gestão completa de informações empresariais**

### 👥 Gestão de Usuários
- **Cadastro e edição** de usuários do sistema
- **Diferentes perfis** (Administrador, Recepcionista, etc.)
- **Controle de acesso** baseado em roles
- **Gestão de permissões** granulares

### 👨‍⚕️ Gestão de Pacientes
- **Cadastro completo** de pacientes com validações
- **Busca e filtros** avançados
- **Paginação** para melhor performance
- **Validação de CPF** e dados pessoais
- **Vinculação automática** à empresa selecionada

### 📍 Gestão de Locais
- **Cadastro de locais** de atendimento
- **Organização hierárquica** de espaços
- **Controle de disponibilidade** de locais

### 🏥 Gestão de Atendimentos
- **Agendamento** de atendimentos
- **Controle de status** (confirmado, pendente, finalizado)
- **Vinculação** paciente-local-profissional
- **Histórico completo** de atendimentos
- **Filtros avançados** por data, paciente, local

### 📊 Dashboard e Relatórios
- **Dashboard interativo** com estatísticas em tempo real
- **Filtros por período** (hoje, semana, mês, ano)
- **Gráficos** de atendimentos e pacientes
- **Relatórios personalizáveis**
- **Exportação de dados**

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **Sequelize** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação e autorização
- **bcrypt** - Criptografia de senhas
- **Yup** - Validação de schemas
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

### Frontend
- **React 19** - Biblioteca JavaScript para interfaces
- **React Router DOM** - Roteamento
- **Axios** - Cliente HTTP
- **Bootstrap 5** - Framework CSS
- **React Bootstrap** - Componentes React + Bootstrap
- **Vite** - Build tool e dev server

### Arquitetura
- **Arquitetura MVC** (Model-View-Controller)
- **Separação de responsabilidades** (Controllers, Services, Models)
- **Middleware pattern** para autenticação e validação
- **API RESTful** com endpoints padronizados

## 📁 Estrutura do Projeto

```
clinical-care/
├── backend/
│   ├── config/           # Configurações do banco e rotas
│   ├── controllers/      # Controladores da aplicação
│   ├── middlewares/      # Middlewares de autenticação e validação
│   ├── models/          # Modelos do Sequelize
│   ├── routes/          # Definição das rotas da API
│   ├── schema/          # Schemas de validação (Yup)
│   ├── services/        # Lógica de negócio
│   └── utils/           # Utilitários
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React reutilizáveis
│   │   ├── pages/       # Páginas da aplicação
│   │   └── utils/       # Utilitários do frontend
│   └── public/          # Arquivos estáticos
```

## 🗄️ Modelo de Dados

### Entidades Principais
- **Users**: Usuários do sistema com diferentes roles
- **Companies**: Empresas/clínicas cadastradas
- **Patients**: Pacientes vinculados às empresas
- **Places**: Locais de atendimento
- **Attendances**: Agendamentos e atendimentos
- **Reports**: Relatórios e estatísticas

### Relacionamentos
- Usuários podem pertencer a uma empresa
- Pacientes são vinculados a uma empresa
- Atendimentos conectam pacientes, locais e usuários
- Sistema de auditoria com timestamps

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js (versão 18 ou superior)
- MySQL (versão 8.0 ou superior)
- npm ou yarn

### Backend

1. **Clone o repositório**
```bash
git clone <url-do-repositorio>
cd clinical-care/backend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
Crie um arquivo `.env` na raiz do backend:
```env
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=clinical_care_db
JWT_SECRET=sua_chave_secreta_jwt
```

4. **Configure o banco de dados**
```sql
CREATE DATABASE clinical_care_db;
```

5. **Execute o servidor**
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

### Frontend

1. **Navegue para o diretório frontend**
```bash
cd ../frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o proxy**
O frontend já está configurado para fazer proxy das requisições para `http://localhost:3000`

4. **Execute o servidor de desenvolvimento**
```bash
npm run dev
```

## 🚀 Como Usar

1. **Acesse a aplicação** em `http://localhost:5173`
2. **Faça login** com suas credenciais
3. **Selecione uma empresa** (se for administrador)
4. **Navegue pelos módulos**:
   - Dashboard: Visualize estatísticas
   - Pacientes: Gerencie cadastros de pacientes
   - Atendimentos: Agende e gerencie atendimentos
   - Locais: Configure locais de atendimento
   - Usuários: Gerencie usuários do sistema
   - Relatórios: Acesse relatórios personalizados

## 🔒 Segurança

- **Autenticação JWT** com tokens seguros
- **Criptografia de senhas** com bcrypt
- **Validação de entrada** com Yup schemas
- **Proteção CORS** configurada
- **Middleware de autenticação** em todas as rotas protegidas
- **Sanitização de dados** de entrada

## 📈 Performance

- **Paginação** implementada em todas as listagens
- **Filtros otimizados** para busca eficiente
- **Lazy loading** de componentes
- **Compressão** de respostas HTTP
- **Cache** de dados frequentes

## 🧪 Testes

O projeto está preparado para implementação de testes:
- **Testes unitários** com Jest
- **Testes de integração** para APIs
- **Testes E2E** com Cypress (estrutura preparada)

## 📝 API Documentation

### Endpoints Principais

#### Autenticação
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/register` - Registro de usuário

#### Empresas
- `GET /api/companies` - Listar empresas
- `POST /api/companies` - Criar empresa
- `PUT /api/companies/:id` - Atualizar empresa
- `DELETE /api/companies/:id` - Deletar empresa

#### Pacientes
- `GET /api/patients` - Listar pacientes
- `POST /api/patients` - Criar paciente
- `PUT /api/patients/:id` - Atualizar paciente
- `DELETE /api/patients/:id` - Deletar paciente

#### Atendimentos
- `GET /api/attendances` - Listar atendimentos
- `POST /api/attendances` - Criar atendimento
- `PUT /api/attendances/:id` - Atualizar atendimento
- `DELETE /api/attendances/:id` - Deletar atendimento

#### Dashboard
- `GET /api/dashboard` - Estatísticas do dashboard

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `LICENSE` para mais detalhes.

## 👨‍💻 Autor

Desenvolvido para demonstrar habilidades em desenvolvimento full-stack com Node.js, React e MySQL.
📧 lucas.noronha.gois@gmail.com

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos canais disponibilizados no perfil do desenvolvedor.

---

**📖 English Version**: [README_EN.md](README_EN.md)

**ClinicalCare** - Transformando a gestão de atendimentos médicos com tecnologia moderna e eficiência.
