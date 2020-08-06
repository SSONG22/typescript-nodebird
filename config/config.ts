import * as dotenv from "dotenv";
dotenv.config();

type Config = {
  username: string;
  password: string;
  database: string;
  host: string;
  [key: string]: string;
};
interface IConfigGroup {
  development: Config;
  test: Config;
  production: Config;
}

const config: IConfigGroup = {
  development: {
    username: "root",
    password: process.env.DB_PASSWORD!,
    database: "node_react",
    host: "127.0.0.1",
    dialect: "mysql",
    // "operatorsAliases": false
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD!,
    database: "node_react",
    host: "127.0.0.1",
    dialect: "mysql",
    // "operatorsAliases": false
  },
  production: {
    username: "root",
    password: process.env.DB_PASSWORD!,
    database: "node_react",
    host: "127.0.0.1",
    dialect: "mysql",
    // "operatorsAliases": false
  },
};

export default config;
