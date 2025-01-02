import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "./redux/postSlice";

function CommentDialog({ dialogOpen, setDialogOpen }) {
  const dispatch = useDispatch();

  const [commentInputText, setCommentInputText] = useState("");
  const handleCommentInputChange = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setCommentInputText(inputText);
    } else {
      setCommentInputText("");
    }
  };
  const [open, setOpen] = useState(false);
  const { selectedPost } = useSelector((store) => store.post);
  const [comments, setComments] = useState(selectedPost?.comments);
  const { posts } = useSelector((store) => store.post);

  useEffect(() => {
    if (selectedPost) {
      setComments(selectedPost?.comments);
    }
  }, [selectedPost]);

  const handleCommentOnPost = async () => {
    try {
      const res = await axios.post(
        `https://socialize-cpzw.onrender.com/api/post/comment/${selectedPost?._id}`,
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
          p._id === selectedPost?._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostCommentStore));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {/* Backdrop Overlay */}
      <DialogOverlay className='fixed inset-0 bg-black bg-opacity-50 z-10' />

      <DialogContent
        className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-lg z-20 rounded-lg max-w-4xl w-full h-[80vh] flex'
        onInteractOutside={() => setDialogOpen(false)}
      >
        {/* Left: Post Image */}
        <div className='flex-1 bg-black'>
          <img
            src={selectedPost?.image}
            alt='Post content'
            className='w-full h-full object-cover'
          />
        </div>

        {/* Right: Comment Section */}
        <div className='w-1/3 bg-white flex flex-col'>
          {/* Header: User Info */}
          <div className='p-4 flex items-center gap-2 border-b'>
            <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
              <AvatarImage
                src={selectedPost?.author?.profilePicture}
                alt='User profile image'
                className='w-full h-full object-cover'
              />
              <AvatarFallback className='bg-gray-300 text-sm font-semibold'>
                CN
              </AvatarFallback>
            </Avatar>
            <div className='font-semibold text-sm'>{selectedPost?.author?.username}</div>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild className='ml-auto'>
                <MoreHorizontal className='cursor-pointer' />
              </DialogTrigger>
              <DialogOverlay className='fixed inset-0 bg-black bg-opacity-50 z-10' />
              <DialogContent className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 shadow-lg z-20 rounded-lg max-w-sm w-full'>
                <div className='flex flex-col gap-3 items-center'>
                  <Button variant='ghost' className='w-fit text-[#ED4956] font-bold'>
                    Unfollow
                  </Button>
                  <Button variant='ghost' className='w-fit'>
                    Add to favorites
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Comments */}
          <div className='flex-1 p-4 overflow-y-auto space-y-4'>
            {comments?.map((comment) => (
              <Comment key={comment._id} comment={comment} />
            ))}
          </div>

          {/* Comment Input */}
          <div className='p-4 border-t flex items-center gap-2'>
            <input
              type='text'
              placeholder='Add a comment...'
              className='flex-1 border-none outline-none focus:ring-0 text-sm p-2'
              value={commentInputText}
              onChange={handleCommentInputChange}
            />
            {commentInputText && (
              <button
                className='text-blue-500 font-semibold text-sm'
                onClick={handleCommentOnPost}
              >
                Post
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
