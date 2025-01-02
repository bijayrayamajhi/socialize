import { useState } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal, Send } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "./redux/postSlice";
import { Badge } from "@/components/ui/badge";
import { setAuthUser, setUserProfile } from "./redux/authSlice";
import useGetUserProfile from "@/hooks/useGetUserProfile";

function Post({ post }) {
  const { user, userProfile } = useSelector((store) => store.auth);
  const [comments, setComments] = useState(post.comments);
  const [commentInputText, setCommentInputText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const { posts, selectedPost } = useSelector((store) => store.post);
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLikeCount, setPostLikeCount] = useState(post.likes.length);

  const isFollowing = user?.following?.includes(post?.author?._id);
  const commentInputChangeHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setCommentInputText(inputText);
    } else {
      setCommentInputText("");
    }
  };

  useGetUserProfile(selectedPost?.author?._id);

  const handleFollow = async (id) => {
    try {
      const res = await axios.get(
        `https://socialize-cpzw.onrender.com/api/user/followAndUnfollow/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        //updating followers and following count in store
        const updatedFollowing = [...user.following, id];
        const updatedFollowers = [...userProfile.followers, user._id];
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleUnfollow = async (id) => {
    try {
      const res = await axios.get(
        `https://socialize-cpzw.onrender.com/api/user/followAndUnfollow/${id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        //updating followers and following count in store
        const updatedFollowing = user?.following.filter((id) => id !== userProfile?._id);
        const updatedFollowers = userProfile?.followers.filter((id) => id !== user?._id);
        dispatch(setAuthUser({ ...user, following: updatedFollowing }));
        dispatch(setUserProfile({ ...userProfile, followers: updatedFollowers }));
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  };

  const handleCommentOnPost = async () => {
    try {
      const res = await axios.post(
        `https://socialize-cpzw.onrender.com/api/post/comment/${post?._id}`,
        { commentInputText },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [res.data.comment, ...comments];
        setComments(updatedCommentData);
        toast.success(res.data.message);
        setCommentInputText("");

        //update the comments array of post in store
        const updatedPostCommentStore = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostCommentStore));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleLikeOrDislike = async (postId) => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `https://socialize-cpzw.onrender.com/api/post/${action}/${postId}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        setLiked(!liked);
        toast.success(res.data.message);
        const updatedPostLikeCount = liked ? postLikeCount - 1 : postLikeCount + 1;
        setPostLikeCount(updatedPostLikeCount);

        // Update likes array of post in store
        const updatedLikesArray = posts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedLikesArray));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const handleDelete = async () => {
    try {
      const res = await axios.post(
        `https://socialize-cpzw.onrender.com/api/post/delete/${post._id}`,
        {}, // Empty body
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const updatedPost = posts.filter((postItem) => postItem?._id !== post?._id);
        dispatch(setPosts(updatedPost));
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  const bookmarkPostHandler = async () => {
    try {
      const res = await axios.get(
        `https://socialize-cpzw.onrender.com/api/post/bookmark/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className='my-8 w-full max-w-md mx-auto border border-gray-200 rounded-lg shadow-md bg-white sm:max-w-lg relative'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-3'>
        <div className='flex items-center gap-2'>
          <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
            <AvatarImage
              src={post.author?.profilePicture}
              alt='User profile image'
              className='w-full h-full object-cover'
            />
            <AvatarFallback className='w-10 h-10 rounded-full overflow-hidden'>
              CN
            </AvatarFallback>
          </Avatar>
          <div className='flex gap-1'>
            <h1 className='text-sm font-semibold text-gray-800 md:text-base'>
              {post.author?.username}
            </h1>
            {user._id === post?.author?._id && <Badge variant='outline'>Author</Badge>}
          </div>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          {/* Trigger */}
          <DialogTrigger asChild>
            <MoreHorizontal
              className='cursor-pointer'
              onClick={() => dispatch(setSelectedPost(post))}
            />
          </DialogTrigger>

          {/* Overlay (Backdrop) */}
          <DialogOverlay className='fixed inset-0 bg-black bg-opacity-50 z-10' />

          {/* Dialog Content */}
          <DialogContent
            className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg z-20 rounded-lg max-w-sm w-full'
            onInteractOutside={() => setOpen(false)}
          >
            <div className='flex flex-col items-center gap-4'>
              {post?.author?._id !== user?._id &&
                (isFollowing ? (
                  <Button
                    variant='ghost'
                    className='w-fit text-[#ED4956] font-bold'
                    onClick={() => handleUnfollow(post?.author?._id)}
                  >
                    Unfollow
                  </Button>
                ) : (
                  <Button
                    variant='ghost'
                    className='w-fit  bg-blue-500 hover:bg-blue-600 font-bold'
                    onClick={() => handleFollow(post?.author?._id)}
                  >
                    Follow
                  </Button>
                ))}
              <Button variant='ghost' className='w-fit'>
                Add to favorites
              </Button>
              {user && user?._id === post?.author?._id && (
                <Button variant='ghost' className='w-fit' onClick={handleDelete}>
                  Delete
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Post Image */}
      <div className='aspect-square bg-gray-200'>
        <img src={post.image} alt='Post content' className='w-full h-full object-cover' />
      </div>

      {/* Post Actions */}
      <div className='px-4 py-2'>
        <div className='flex items-center justify-between'>
          <div className='flex gap-4'>
            {liked ? (
              <FaHeart
                className='w-6 h-6 cursor-pointer text-red-600'
                onClick={() => handleLikeOrDislike(post?._id)}
              />
            ) : (
              <Heart
                className='w-6 h-6 cursor-pointer'
                onClick={() => handleLikeOrDislike(post?._id)}
              />
            )}

            <MessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setDialogOpen(true);
              }}
              className='w-6 h-6 cursor-pointer text-gray-500 hover:text-blue-500'
            />
            <Send className='w-6 h-6 cursor-pointer text-gray-500 hover:text-green-500' />
          </div>

          <Bookmark
            onClick={bookmarkPostHandler}
            className='w-6 h-6 cursor-pointer text-gray-500 hover:text-yellow-500'
          />
        </div>
        <p className='mt-2 text-sm font-semibold text-start'>{postLikeCount} likes</p>
        <p className='mt-2 text-sm font-semibold text-start'>{post.caption}</p>
      </div>

      {/* Comments Section */}
      <div className='px-4 py-2'>
        {comments.length > 0 && (
          <span
            onClick={() => {
              dispatch(setSelectedPost(post));
              setDialogOpen(true);
            }}
            className='text-gray-400 text-sm cursor-pointer'
          >
            View all {post?.comments?.length} comments
          </span>
        )}
        <CommentDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      </div>

      {/* Add Comment */}
      <div className='px-4 py-3 border-t'>
        <div className='flex items-center'>
          <input
            type='text'
            placeholder='Add a comment...'
            className='flex-1 border-none outline-none focus:ring-0 text-sm'
            value={commentInputText}
            onChange={commentInputChangeHandler}
          />
          {commentInputText && (
            <button
              className='text-blue-500 font-semibold text-sm ml-2'
              onClick={handleCommentOnPost}
            >
              Post
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
