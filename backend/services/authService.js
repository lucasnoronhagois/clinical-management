import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../models/index.js'

export default class AuthService {

  async login(credentials) {
    const { login, password } = credentials;

/* 

*/

    // Busca usuário por email ou login (ambos logam)
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { email: login },
          { login: login }
        ]
      }
    });

    if (!user) {
      // Usar uma senha fake para evitar timing attacks
      user = { password: '$2b$10$4NIkmO5x9zqAdneUQJ/5EuGTHh2Sno/vMjN/IkoJQWFzh8JrEfKl.adasdadasd' };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Usuário ou senha inválidos.');
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        root: user.root,
        company_id: user.company_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return { token };
  }

  async register(userData) {
    const { name, email, login, password, cpf, phone, role, root = false, company_id } = userData;

    if (!name || !email || !login || !password || !cpf || !role || !company_id) {
      throw new Error('Campos obrigatórios faltando.');
    }

    // Verificar se email, login ou cpf já existem
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email },
          { login },
          { cpf }
        ]
      }
    });

    if (existingUser) {
      throw new Error('Email, Login ou CPF já cadastrado.');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar o usuário
    const newUser = await User.create({
      name,
      email,
      login,
      password: hashedPassword,
      cpf,
      phone,
      role,
      root,
      company_id
    });

    // Garantir que não retorna a senha
    const userResponse = { ...newUser.get(), password: undefined };
    return userResponse;
  }
} 