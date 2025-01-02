import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;

    if (!image) {
      return res.status(400).json({
        message: "Image is required",
        success: false,
      });
    }

    if (image.size > 5 * 1024 * 1024) {
      // 5MB limit
      return res.status(400).json({ message: "Image size is too large", success: false });
    }

    // Optimize image with sharp
    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // Convert image to data URI
    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;

    const cloudResponse = await cloudinary.uploader.upload(fileUri);

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    // Fetch user with await
    const user = await User.findById(authorId);
    if (user) {
      const postId = post._id;
      user.posts.push(postId);
      await user.save();
    } else {
      console.error("User not found");
      return res.status(404).json({ message: "User not found", success: false });
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "Post cconsole.log(input);reated successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });
    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const getAuthorPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const currUserId = req.id;
    const targetedPostId = req.params.id;
    const post = await Post.findById(targetedPostId);
    if (!post) {
      return res.status(404).json({ message: "post not found", success: false });
    }
    await post.updateOne({ $addToSet: { likes: currUserId } });
    await post.save();

    //implementing socket.io for real time like notification
    const user = await User.findById(currUserId).select("username profilePicture");
    const postOwnerID = post?.author.toString();

    if (user?._id !== postOwnerID) {
      //emit a notification event
      const notification = {
        type: "like",
        userDetails: user,
        targetedPostId,
        message: "liked your post ",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerID);
      io.to(postOwnerSocketId).emit("notifications", notification);
    }

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const currUserId = req.id;
    const targetedPostId = req.params.id;
    const post = await Post.findById(targetedPostId);
    if (!post) {
      return res.status(404).json({
        message: "post not found",
        success: false,
      });
    }

    await post.updateOne({ $pull: { likes: currUserId } });
    await post.save();

    //implementing socket.io for real time dislike notification
    const user = await User.findById(currUserId).select("username profilePicture");
    const postOwnerId = post?.author.toString();

    if (user?._id !== postOwnerId) {
      //emit a notification

      const notification = {
        type: "dislike",
        userDetails: user,
        targetedPostId,
        message: "dislike your post ",
      };
      const postOwnerSocketId = getReceiverSocketId(postOwnerId);
      io.to(postOwnerSocketId).emit("notifications", notification);
    }

    return res.status(200).json({
      message: "Post disliked",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const currUserId = req.id;
    const targetedPostId = req.params.id;
    const post = await Post.findById(targetedPostId);

    const { commentInputText } = req.body;
    if (!commentInputText) {
      return res.status(400).json({
        message: "you cannot post empty comment",
        success: false,
      });
    }

    const comment = await Comment.create({
      text: commentInputText,
      author: currUserId,
      post: targetedPostId,
    });

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });
    post.comments.push(comment._id);
    await post.save();

    return res.status(201).json({
      comment,
      message: "comment added",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
};

export const getAllCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comment.find({ post: postId }).populate({
      path: "author",
      select: "username , profilePicture",
    });

    if (!comments) {
      return res
        .status(404)
        .json({ message: "No comment found for this post", success: false });
    }

    return res.status(200).json({
      comments,
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

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const currUserId = req.id;

    // Find the post
    const post = await Post.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({
        message: "Post not found",
        success: false,
      });
    }

    // Check if the user is authorized to delete the post
    if (post?.author?.toString() !== currUserId) {
      console.log("Post Author:", post?.author?.toString());
      console.log("Current User:", currUserId);
      return res.status(403).json({
        message: "You are not authorized to delete this post",
        success: false,
      });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Remove the postId from the user's posts array
    const user = await User.findById(currUserId);
    user.posts = user.posts.filter((_id) => _id.toString() !== postId);
    await user.save();

    // Delete associated comments
    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      message: "Post deleted successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const currUserId = req.id;
    const postId = req.params.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "post not found", success: false });
    }
    const user = await User.findById(currUserId);
    const isAlreadyBookmarked = user.bookmarks.includes(post._id);
    if (isAlreadyBookmarked) {
      //unbookmark logic
      const user = await User.updateOne({ $pull: { bookmarks: post._id } });

      return res.status(200).json({
        type: "unsaved",
        message: "unbookmarked successfully!",
        success: true,
      });
    } else {
      //bookmark logic
      const user = await User.updateOne({ $addToSet: { bookmarks: post._id } });

      return res.status(200).json({
        type: "saved",
        message: "bookmarked successfully!",
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
