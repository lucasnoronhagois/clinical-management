const bcrypt = require('bcrypt');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Configuração do banco
const sequelize = new Sequelize(
  process.env.DB_NAME || 'clinical_management',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  }
);

// Modelo User (simplificado)
const User = sequelize.define('User', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  login: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  cpf: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: true
  },
  role: {
    type: Sequelize.ENUM('ADMIN', 'DOCTOR', 'RECEPTIONIST'),
    allowNull: false,
    defaultValue: 'RECEPTIONIST'
  },
  root: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  company_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true
});

async function createTestUser() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco estabelecida!');

    // Sincronizar modelo
    await User.sync({ force: false });
    console.log('✅ Modelo sincronizado!');

    // Verificar se já existe um usuário admin
    const existingAdmin = await User.findOne({
      where: { email: 'admin@test.com' }
    });

    if (existingAdmin) {
      console.log('✅ Usuário admin já existe!');
      console.log('Email: admin@test.com');
      console.log('Login: admin');
      console.log('Senha: 123456');
      return;
    }

    // Criar empresa de teste primeiro (se necessário)
    const Company = sequelize.define('Company', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cnpj: {
        type: Sequelize.STRING,
        allowNull: true
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      }
    }, {
      tableName: 'companies',
      timestamps: true
    });

    await Company.sync({ force: false });

    // Criar empresa de teste
    let company = await Company.findOne({ where: { name: 'Empresa Teste' } });
    if (!company) {
      company = await Company.create({
        name: 'Empresa Teste',
        cnpj: '12345678000199',
        address: 'Rua Teste, 123',
        phone: '(11) 99999-9999',
        email: 'contato@empresateste.com'
      });
      console.log('✅ Empresa de teste criada!');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Criar usuário admin
    const adminUser = await User.create({
      name: 'Administrador',
      email: 'admin@test.com',
      login: 'admin',
      password: hashedPassword,
      cpf: '12345678901',
      phone: '(11) 99999-9999',
      role: 'ADMIN',
      root: true,
      company_id: company.id
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@test.com');
    console.log('👤 Login: admin');
    console.log('🔑 Senha: 123456');
    console.log('🏢 Empresa: Empresa Teste');

  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await sequelize.close();
  }
}

createTestUser();
