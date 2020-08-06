import User, { associate as associateUser } from "./user";
import Comment, { associate as associateComment } from "./comment";
import HashTag, { associate as associateHashTag } from "./hashtag";
import Image, { associate as associateImage } from "./image";
import Post, { associate as associatePost } from "./post";

export * from "./sequelize"; //import + export

const db = {
  User,
  Comment,
  HashTag,
  Image,
  Post,
};
export type dbType = typeof db;

associateUser(db);
associateComment(db);
associateHashTag(db);
associateImage(db);
associatePost(db);
