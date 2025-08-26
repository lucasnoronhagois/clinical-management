import { DataTypes, Model, Sequelize } from 'sequelize';

interface PatientAttributes {
  id?: number;
  name: string;
  cpf?: string;
  birth_date: Date;
  company_id: number;
  is_deleted: boolean;
  created_at: Date;
}

interface PatientCreationAttributes extends Omit<PatientAttributes, 'id' | 'is_deleted' | 'created_at'> {
  is_deleted?: boolean;
  created_at?: Date;
}

export default class Patient extends Model<PatientAttributes, PatientCreationAttributes> {
  declare id: number;
  declare name: string;
  declare cpf: string | null;
  declare birth_date: Date;
  declare company_id: number;
  declare is_deleted: boolean;
  declare created_at: Date;

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
      cpf: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          len: [11, 14], // ja preparado pra aceitar com ou sem format
        },
      },
      birth_date: {
        type: DataTypes.DATE,
        allowNull: false,
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    }, {
      sequelize,
      tableName: 'patients',
      timestamps: false,
      paranoid: false,
      underscored: true,
    });
  }

  static associate(models: any) {
    Patient.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  }
}
