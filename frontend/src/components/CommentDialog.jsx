import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import Comment from "./Comment";

function CommentDialog({ dialogOpen, setDialogOpen }) {
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
            <Avatar className='w-8 h-8'>
              <AvatarImage
                src={selectedPost?.author?.profilePicture}
                alt='User profile image'
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
            {selectedPost?.comments.map((comment) => (
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
              <button className='text-blue-500 font-semibold text-sm'>Post</button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
