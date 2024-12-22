import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import bcrypt from "bcryptjs";
import { getDataUri } from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateToken } from "../utils/generateToken.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/email.js";
import crypto from "crypto";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exist",
        success: false,
      });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateVerificationCode();

    await User.create({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 60 * 60 * 1000,
    });

    const userWithoutPassword = await User.findOne({ email }).select("-password");

    generateToken(res, userWithoutPassword);

    await sendVerificationEmail(username, email, verificationToken);

    return res.status(201).json({
      message:
        "User registered successfully! Please check your email to verify your account.",
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist",
        success: false,
      });
    }

    const isCorrectPass = await bcrypt.compare(password, user.password);

    if (!isCorrectPass) {
      return res.status(401).json({
        message: "Incorrect password",
        success: false,
      });
    }

    generateToken(res, user);
    user.lastLogin = new Date();

    const userWithoutPassword = await User.findOne({ email }).select("-password");

    if (!userWithoutPassword) {
      return res.status(404).json({
        message: "User data retrieval failed",
        success: false,
      });
    }

    const postsArray = userWithoutPassword.posts || [];
    const populatedPosts = await Promise.all(
      postsArray.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author.equals(userWithoutPassword._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts.filter((post) => post !== null),
      lastLogin: user.lastLogin,
      isVerified: user.isVerified,
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordTokenExpiresAt: user.resetPasswordTokenExpiresAt,
      verificationToken: user.verificationToken,
      verificationTokenExpiresAt: user.verificationTokenExpiresAt,
    };

    return res.status(200).json({
      message: `Welcome back ${user.username}`,
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { verificationToken } = req.body;

    const user = await User.findOne({
      verificationToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "invalid or expired verification token",
        success: false,
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.username);

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: "success",
    });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 0,
      })
      .json({
        message: "logged out successfully",
        success: true,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      return res.status(400).json({
        message: "User donot exist",
        success: false,
      });
    }

    const resetPasswordToken = crypto.randomBytes(40).toString("hex");
    const resetPasswordTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
    user.save();

    //sending password reset link to the email
    await sendPasswordResetEmail(
      user.email,
      `${process.env.FRONTEND_URL}/reset-password/${resetPasswordToken}`
    );

    return res.status(200).json({
      message: "Password reset link is sent to your email!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired reset token",
        success: false,
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    user.save();

    await sendResetSuccessEmail(user.email);

    return res.status(200).json({
      message: "Password reset successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({
        message: "user dont exist",
        success: false,
      });
    }
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
      user.profilePicture = cloudResponse.secure_url;
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;

    user.save();

    return res.status(200).json({
      user,
      message: "user profile updated",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "currently no user to suggest",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const followAndUnfollow = async (req, res) => {
  try {
    const currUserId = req.id;
    const targetedUserId = req.params.id;

    if (currUserId === targetedUserId) {
      return res.status(400).json({
        message: "you cannot follow and unfollow yourself",
        success: false,
      });
    }

    const currUser = await User.findById(currUserId);
    const targetedUser = await User.findById(targetedUserId);

    if (!currUser || !targetedUser) {
      return res.status(400).json({
        message: "user doesnot exist",
        success: false,
      });
    }

    const isFollowing = currUser.following.includes(targetedUserId);
    if (isFollowing) {
      //unfollow logic
      await Promise.all([
        User.updateOne({ _id: currUserId }, { $pull: { following: targetedUserId } }),
        User.updateOne({ _id: targetedUserId }, { $pull: { followers: currUserId } }),
      ]);
      return res.status(200).json({
        message: "unfollowed successfully",
        success: true,
      });
    } else {
      //follow logic
      await Promise.all([
        User.updateOne({ _id: currUserId }, { $push: { following: targetedUserId } }),
        User.updateOne({ _id: targetedUserId }, { $push: { followers: currUserId } }),
      ]);
      return res.status(200).json({
        message: "followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};
