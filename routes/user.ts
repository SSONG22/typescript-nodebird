import * as express from "express";
import * as bcrypt from "bcrypt";
import * as passport from "passport";
import * as session from "express-session";
import { isLoggedIn, isNotLoggedIn } from "./middleware";
import User from "../models/user";
import Post from "../models/post";
import { nextTick } from "process";

const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  const user = req.user!.toJSON() as User; // ! 붙이는 이유: ts 는 user 가 존재하는 지 모르기 때문
  delete user.password;
  return res.json(user);
}); // 알아서 타입 추론이 된다.

// 회원가입
router.post("/", async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    if (exUser) {
      return res.status(403).send("이미 사용 중인 아이디 입니다."); // 중복 체크
    }
    const hashedPassword = await bcrypt.hash(req.body.hashedPassword, 12); // 암호화는 1초 정도 걸리면 됨. 숫자가 높을수록 해킹위험도가 낮아짐.
    const newUser = await User.create({
      nickname: req.body.nickname,
      user: req.body.userId,
      password: hashedPassword,
    });
    return res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// 로그인
router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate(
    "local",
    (err: Error, user: User, info: { message: string }) => {
      // 타입추론이 any로 되어 있으면 직접 타입명시해준다
      if (err) {
        console.log(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.message);
      }
      return req.login(user, async (loginErr: Error) => {
        try {
          if (loginErr) {
            return next(loginErr);
          }
          const fullUser = await User.findOne({
            where: { id: user.id },
            include: [
              {
                model: Post,
                as: "Posts",
                attributes: ["id"],
              },
              {
                model: User,
                as: "Followings",
                attributes: ["id"],
              },
              {
                model: User,
                as: "Followers",
                attributes: ["id"],
              },
            ],
            attributes: {
              exclude: ["password"],
            },
          });
          return res.json(fullUser);
        } catch (e) {
          console.error(e);
          next(e);
        }
      });
    }
  )(req, res, next);
});

// 로그아웃
router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session!.destroy(() => {
    res.send("logout 성공");
  }); // go to definition > destroy 에 콜백을 넣어줘야 한다.
});

// 기존 User 확장
// 한번만 쓰이면 바로 위에 쓰고
// 자주 쓰이면 export 붙이고 types 폴더로 옮겨준다.
interface IUser extends User {
  PostCount: number;
  FollowingCount: number;
  FollowerCount: number;
}
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.id, 10) },
      include: [
        {
          model: Post,
          as: "Posts",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followings",
          attributes: ["id"],
        },
        {
          model: User,
          as: "Followers",
          attributes: ["id"],
        },
      ],
      attributes: {
        exclude: ["password"],
      },
    });

    if (!user) {
      return res.status(404).send("no user");
    }
    const jsonUser = user.toJSON() as IUser;
    jsonUser.PostCount = jsonUser.Posts!.length;
    jsonUser.FollowingCount = jsonUser.Followings
      ? jsonUser.Followings.length
      : 0;
    jsonUser.FollowerCount = jsonUser.Followers!.length;

    return res.json(jsonUser);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/:id/followings", isLoggedIn, async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
      },
    });
    if (!user) return res.status(404).send("no user");
    const follower = await user.getFollowings({
      attributes: ["id", "nickname"],
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});
