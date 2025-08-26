import { DataTypes, Model, Sequelize } from 'sequelize';

interface CompanyAttributes {
  id?: number;
  name: string;
  email: string;
  zip_code: string;
  adress_street: string;
  adress_number: string;
  adress_complement?: string;
  adress_neighborhood: string;
  adress_city: string;
  adress_state: string;
  is_deleted: boolean;
}

interface CompanyCreationAttributes extends Omit<CompanyAttributes, 'id' | 'is_deleted'> {
  is_deleted?: boolean;
}

export default class Company extends Model<CompanyAttributes, CompanyCreationAttributes> {
  declare id: number;
  declare name: string;
  declare email: string;
  declare zip_code: string;
  declare adress_street: string;
  declare adress_number: string;
  declare adress_complement: string | null;
  declare adress_neighborhood: string;
  declare adress_city: string;
  declare adress_state: string;
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
        validate: {
          isEmail: true,
        },
      },
      zip_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adress_street: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adress_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adress_complement: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      adress_neighborhood: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adress_city: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      adress_state: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    }, {
      sequelize,
      tableName: 'companies',
      timestamps: false,
      paranoid: false,
      underscored: true,
    });
  }
}
