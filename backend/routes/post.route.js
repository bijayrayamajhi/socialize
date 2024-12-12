import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

import upload from "../middlewares/multer.js";
import {
  addComment,
  addNewPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllCommentsOfPost,
  getAllPost,
  getAuthorPost,
  likePost,
} from "../controllers/post.controller.js";

const router = express.Router();

router.route("/addpost").post(isAuthenticated, upload.single("image"), addNewPost);
router.route("/allpost").get(isAuthenticated, getAllPost);
router.route("/userpost/all").get(isAuthenticated, getAuthorPost);
router.route("/like/:id").get(isAuthenticated, likePost);
router.route("/dislike/:id").get(isAuthenticated, dislikePost);
router.route("/comment/:id").post(isAuthenticated, addComment);
router.route("/comment/all/:id").get(isAuthenticated, getAllCommentsOfPost);
router.route("/delete/:id").post(isAuthenticated, deletePost);
router.route("/bookmark/:id").post(isAuthenticated, bookmarkPost);

export default router;
