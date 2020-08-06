import { Model, DataTypes } from "sequelize";
import { dbType } from "./index";
import Post from "./post";
import { sequelize } from "./sequelize";

//sequelize model 선언 방법
class User extends Model {
  public readonly id!: number;
  public nickname!: string;
  public userId!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly Posts?: Post[]; // Post는 있을수도있고 없을수도 있어서 ?
  public readonly Followers?: User[];
  public readonly Followings?: User[];
}

User.init(
  {
    nickname: {
      type: DataTypes.STRING(20),
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize, //모델에 연결
    modelName: "User",
    tableName: "user",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

//관계 설정
export const associate = (db: dbType) => {};

export default User;
