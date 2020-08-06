import * as passport from "passport";
import User from "../models/user";
//import {User} from '../models';

export default () => {
  //로그인할때
  passport.serializeUser((user: User, done) => {
    done(null, user.id);
  });

  //모든 요청에 대해
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findOne({
        where: { id },
      });
      return done(null, user); //req.user
    } catch (err) {
      console.log(err);
      return done(err);
    }
  });
  // local();
};
