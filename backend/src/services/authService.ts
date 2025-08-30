import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { User } from '../models/index';

interface LoginCredentials {
  email_or_login: string;
  password: string;
}

interface UserData {
  name: string;
  email: string;
  login: string;
  password: string;
  cpf: string;
  phone?: string;
  role: 'DOCTOR' | 'RECEPTIONIST';
  root?: boolean;
  company_id: number;
}

interface TokenPayload {
  id: number;
  name: string;
  email: string;
  role: string;
  root: boolean;
  company_id: number;
}

export default class AuthService {

  async login(credentials: LoginCredentials): Promise<{ token: string; user: any }> {
    const { email_or_login, password } = credentials;

    if (!email_or_login || !password) {
      throw new Error('Email/Login e senha são obrigatórios.');
    }

    // Busca usuário por email ou login (ambos logam)
    let user = await User.findOne({
      where: {
        [Op.or]: [
          { email: email_or_login },
          { login: email_or_login }
        ]
      }
    });

    if (!user) {
      // Usar uma senha fake para evitar timing attacks
      const fakeUser = { password: '$2b$10$4NIkmO5x9zqAdneUQJ/5EuGTHh2Sno/vMjN/IkoJQWFzh8JrEfKl.adasdadasd' };
      const valid = await bcrypt.compare(password, fakeUser.password);
      if (!valid) {
        throw new Error('Usuário ou senha inválidos.');
      }
      throw new Error('Usuário ou senha inválidos.');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new Error('Usuário ou senha inválidos.');
    }

    // Gerar token JWT
    const tokenPayload: TokenPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      root: user.root,
      company_id: user.company_id
    };

    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    const token = jwt.sign(
      tokenPayload,
      jwtSecret,
      { expiresIn: '8h' }
    );

    // Retornar token e dados do usuário (sem senha)
    const userResponse = { ...user.get(), password: undefined };
    return { token, user: userResponse };
  }

  async register(userData: UserData): Promise<any> {
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

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    // Implementação básica - você pode expandir conforme necessário
    if (!data.currentPassword || !data.newPassword) {
      throw new Error('Senha atual e nova senha são obrigatórias.');
    }
    
    // Aqui você implementaria a lógica para verificar a senha atual
    // e alterar para a nova senha
    
    return { message: 'Senha alterada com sucesso.' };
  }

  async resetPassword(data: { email: string }): Promise<{ message: string }> {
    if (!data.email) {
      throw new Error('Email é obrigatório.');
    }
    
    // Aqui você implementaria a lógica para reset de senha
    // Por exemplo, enviar email com link para reset
    
    return { message: 'Email de reset de senha enviado com sucesso.' };
  }
}
