import { DataTypes, Model, Optional } from "sequelize";
import connection from "../connection";

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  verified: boolean;
  apikey?: string;
  verificationCode?: string;
  verificationExpiredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface UserInput extends Optional<IUser, "id"> {}

class User extends Model<IUser, UserInput> implements IUser {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare verified: boolean;
  declare verificationCode?: string;
  declare verificationExpiredAt?: Date;
  declare apikey: string;

  // timestamps
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
  declare readonly deletedAt: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    apikey: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    verificationCode: {
      type: DataTypes.STRING,
      unique: true
    },
    verificationExpiredAt: {
      type: DataTypes.DATE
    }
    // description: {
    //   type: DataTypes.TEXT,
    // },
  },
  {
    tableName: "users",
    timestamps: true,
    sequelize: connection,
    paranoid: true
  }
);

export default User;
