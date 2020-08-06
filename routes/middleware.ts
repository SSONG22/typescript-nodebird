import { Request, Response, NextFunction } from "express";
// import {is} from 'bluebird';

const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인이 필요합니다");
  }
};

const isNotLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send("로그인한 사용자는 접근할 수 없습니다.");
  }
};

export { isLoggedIn, isNotLoggedIn };

//하나의 함수일 뿐이니까 매개변수와 리턴값 type을 직접 타이핑을 해줘야한다.
