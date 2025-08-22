import { DataTypes, Model } from 'sequelize';

export default class Patient extends Model {
  static load(sequelize) {
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
    })
  }

  static associate(models) {
    Patient.belongsTo(models.Company, { foreignKey: 'company_id', as: 'company' });
  }
} 