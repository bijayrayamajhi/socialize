import express from "express";
import {
  checkAuth,
  editProfile,
  followAndUnfollow,
  forgotPassword,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
  resetPassword,
  verifyEmail,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import upload from "../middlewares/multer.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/schemaValidate/validateUserSchema.js";

const router = express.Router();
router.route("/").get(isAuthenticated);
router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/register").post(validateRegister, register);
router.route("/login").post(validateLogin, login);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/logout").get(logout);

router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);
router.route("/suggested").get(isAuthenticated, getSuggestedUsers);
router.route("/followAndUnfollow/:id").post(isAuthenticated, followAndUnfollow);

export default router;
