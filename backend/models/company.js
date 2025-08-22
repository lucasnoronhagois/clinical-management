import { DataTypes, Model } from 'sequelize';

export default class Company extends Model {
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
    })
  }
} 