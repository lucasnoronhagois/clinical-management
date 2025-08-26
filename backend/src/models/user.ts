import { DataTypes, Model, Sequelize } from 'sequelize';

interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  login: string;
  password: string;
  cpf: string;
  phone?: string;
  role: 'DOCTOR' | 'RECEPTIONIST';
  root: boolean;
  company_id: number;
  is_deleted: boolean;
}

interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'is_deleted'> {
  is_deleted?: boolean;
}

export default class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare name: string;
  declare email: string;
  declare login: string;
  declare password: string;
  declare cpf: string;
  declare phone: string | null;
  declare role: 'DOCTOR' | 'RECEPTIONIST';
  declare root: boolean;
  declare company_id: number;
  declare is_deleted: boolean;

  static load(sequelize: Sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cpf: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('DOCTOR', 'RECEPTIONIST'),
        allowNull: false,
      },
      root: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'companies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      sequelize,
      tableName: 'users',
      timestamps: false,
      paranoid: false,
      underscored: true,
    });
  }
}
