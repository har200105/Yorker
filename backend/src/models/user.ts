import { sequelize } from "../database";
import { DataTypes, Model, Optional } from "sequelize";

interface UserAttributes {
  id: string;
  username: string;
  password: string;
  email?: string;
  createdAt?: Date;
}

type UserCreationAttributes = Optional<UserAttributes, "id" | "createdAt">;

export class UserInstance extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  id!: string;
  username!: string;
  password!: string;
  email?: string;
  createdAt?: Date;
}

export const UserModel = sequelize.define<UserInstance>(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }
);
