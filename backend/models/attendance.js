import { DataTypes, Model } from 'sequelize';

export default class Attendance extends Model {
  static load(sequelize) {
    return super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      confirmed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      confirmed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      receptionist_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
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
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      patient_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'patients',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      place_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'places',
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
      tableName: 'attendances',
      timestamps: false,
      paranoid: false,
      underscored: true,
    })
  }

  static associate(models) {
    Attendance.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
    Attendance.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Attendance.belongsTo(models.User, { foreignKey: 'receptionist_id', as: 'receptionist' });
    Attendance.belongsTo(models.Place, { foreignKey: 'place_id', as: 'place' });
  }
} 