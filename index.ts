import * as express from "express";
import * as dotenv from "dotenv";
import * as morgan from "morgan";
import * as cors from "cors";
import * as hpp from "hpp";
import * as helmet from "helmet";

import { sequelize } from "./models/sequelize";

dotenv.config();
const app = express();
const prod: boolean = process.env.NODE_ENV === "production";

app.set("port", prod ? process.env.NODE_ENV : 3065);
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err: Error) => {
    console.log(err);
  });
//force -> true 디비 재시작
if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: /ours\.com$/,
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
}
