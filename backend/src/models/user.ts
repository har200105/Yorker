import { sequelize } from "../database";
import { compare, hash } from "bcryptjs";
import { DataTypes, Model, ModelDefined, Optional } from "sequelize";
import { IAuthDocument } from "src/types/auth";

const SALT_ROUND = 10;

interface UserModelInstance extends Model<IAuthDocument, UserCreationAttributes> {
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

type UserCreationAttributes = Optional<IAuthDocument, "id" | "createdAt">;

const UserModel: ModelDefined<IAuthDocument, UserCreationAttributes> & {
  prototype: UserModelInstance;
} = sequelize.define(
  "auths",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        unique: true,
        fields: ["username"],
      },
    ],
  }
) as ModelDefined<IAuthDocument, UserCreationAttributes> & {
  prototype: UserModelInstance;
};

UserModel.addHook("beforeCreate", async (auth: Model) => {
  const hashedPassword: string = await hash(auth.getDataValue("password"), SALT_ROUND);
  auth.setDataValue("password", hashedPassword);
});

UserModel.prototype.comparePassword = async function (password: string): Promise<boolean> {
  return compare(password, this.getDataValue("password"));
};

UserModel.prototype.hashPassword = async function (password: string): Promise<string> {
  return hash(password, SALT_ROUND);
};

UserModel.sync({});

export { UserModel };
