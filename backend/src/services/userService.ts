import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { User } from '../models/index';

interface UserFilters {
  company_id?: string;
  name?: string;
  role?: string;
  page?: string;
  limit?: string;
}

interface UserData {
  name: string;
  email: string;
  login: string;
  password?: string;
  cpf: string;
  phone?: string;
  role: 'DOCTOR' | 'RECEPTIONIST';
  root?: boolean;
  company_id: number;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ListResult {
  users: any[];
  pagination?: Pagination;
}

export default class UserService {

  async find(id: string): Promise<any> {
    const user = await User.findByPk(id, {
      attributes: ['id', 'login']
    });
    
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    
    return user;
  }

  async findForUpdate(id: string): Promise<any> {
    const user = await User.findOne({
      where: {
        id: id,
        is_deleted: false
      }
    });
    
    if (!user) {
      throw new Error('Usuário não encontrado.');
    }
    
    return user;
  }

  async list(filters: UserFilters): Promise<ListResult> {
    const { company_id, name, role, page, limit: limitParam } = filters;
    
    let whereClause: any = { is_deleted: false };
    
    if (company_id) {
      whereClause.company_id = parseInt(company_id);
    }
    
    if (name) {
      whereClause.name = {
        [Op.like]: `%${name}%`
      };
    }
    
    if (role) {
      whereClause.role = role;
    }

    let queryOptions: any = {
      where: whereClause,
      attributes: { exclude: ['password'] },
      order: [['name', 'ASC']]
    };

    if (limitParam || page) {
      const limit = limitParam ? parseInt(limitParam) : 3;
      const pageNum = page ? parseInt(page) : 1;
      const offset = (pageNum - 1) * limit;
      queryOptions.limit = limit;
      queryOptions.offset = offset;
    }

    const { count, rows: users } = await User.findAndCountAll(queryOptions);
    
    let pagination: Pagination | undefined = undefined;
    if (queryOptions.limit) {
      pagination = {
        currentPage: page ? parseInt(page) : 1,
        totalPages: Math.ceil(count / queryOptions.limit),
        totalItems: count,
        itemsPerPage: queryOptions.limit
      };
    }

    return {
      users,
      ...(pagination ? { pagination } : {})
    };
  }

  async create(userData: UserData): Promise<any> {
    // Verificar se login já existe
    const totalUsers = await User.count({
      where: {
        login: userData.login
      }
    });

    if (totalUsers) {
      throw new Error('LOGIN_USADO');
    }

    // Criptografar senha se fornecida
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Garantir que password seja string
    if (!userData.password) {
      throw new Error('Senha é obrigatória');
    }

    // Garantir que is_deleted seja false
    const finalUserData = {
      ...userData,
      password: userData.password,
      root: userData.root || false,
      is_deleted: false
    };

    return await User.create(finalUserData);
  }

  async createMultiple(usersData: UserData[]): Promise<any[]> {
    const createdUsers = [];
    
    for (const userData of usersData) {
      const user = await this.create(userData);
      createdUsers.push(user);
    }
    
    return createdUsers;
  }

  async update(id: string, updateData: Partial<UserData>): Promise<any> {
    const user = await this.findForUpdate(id);
    
    // Se estiver atualizando a senha, criptografar
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    
    await user.update(updateData);
    return user;
  }

  async delete(id: string): Promise<{ message: string }> {
    const user = await this.findForUpdate(id);
    await user.update({ is_deleted: true });
    return { message: 'Usuário deletado.' };
  }
}
