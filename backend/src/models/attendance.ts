import { DataTypes, Model, Sequelize } from 'sequelize';

interface AttendanceAttributes {
  id?: number;
  confirmed_at?: Date;
  confirmed_by?: number;
  receptionist_id?: number;
  user_id: number;
  company_id: number;
  start_date: Date;
  end_date?: Date;
  patient_id: number;
  place_id: number;
  is_deleted: boolean;
}

interface AttendanceCreationAttributes extends Omit<AttendanceAttributes, 'id' | 'is_deleted'> {
  is_deleted?: boolean;
}

export default class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> {
  declare id: number;
  declare confirmed_at: Date | null;
  declare confirmed_by: number | null;
  declare receptionist_id: number | null;
  declare user_id: number;
  declare company_id: number;
  declare start_date: Date;
  declare end_date: Date | null;
  declare patient_id: number;
  declare place_id: number;
  declare is_deleted: boolean;

  static load(sequelize: Sequelize) {
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
    });
  }

  static associate(models: any) {
    Attendance.belongsTo(models.Patient, { foreignKey: 'patient_id', as: 'patient' });
    Attendance.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Attendance.belongsTo(models.User, { foreignKey: 'receptionist_id', as: 'receptionist' });
    Attendance.belongsTo(models.Place, { foreignKey: 'place_id', as: 'place' });
  }
}
