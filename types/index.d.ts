import User from "../models/user";
// export {} import나 export 문 하나 필요
declare module "express-serve-static-core" {
  interface Request {
    user?: User;
    // payload: any;
  }
}
