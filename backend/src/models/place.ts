import { DataTypes, Model, Sequelize } from 'sequelize';

interface PlaceAttributes {
  id?: number;
  name: string;
  company_id: number;
  is_deleted: boolean;
}

interface PlaceCreationAttributes extends Omit<PlaceAttributes, 'id' | 'is_deleted'> {
  is_deleted?: boolean;
}

export default class Place extends Model<PlaceAttributes, PlaceCreationAttributes> {
  declare id: number;
  declare name: string;
  declare company_id: number;
  declare is_deleted: boolean;

  static load(sequelize: Sequelize) {
    return super.init({
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
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
    }, {
      sequelize,
      tableName: 'places',
      timestamps: false,
      paranoid: false,
      underscored: true,
    });
  }
}
