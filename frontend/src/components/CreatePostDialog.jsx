import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Dialog, DialogContent, DialogOverlay } from "@radix-ui/react-dialog";
import { DialogHeader } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "./redux/postSlice";

function CreatePostDialog({ open, setOpen }) {
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => setMedia(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/post/addPost", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open}>
      <DialogOverlay className='fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300 ease-in-out' />
      <DialogContent
        className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white shadow-2xl z-20 rounded-lg max-w-lg w-full p-6 space-y-6 transition-transform duration-300'
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader className='text-center text-2xl font-bold text-gray-800'>
          Create New Post
        </DialogHeader>

        <div className='flex items-center gap-2'>
          <Avatar className='w-12 h-12 rounded-full overflow-hidden'>
            <AvatarImage src={user?.profilePicture} alt='Profile Image' />
            <AvatarFallback className='bg-gray-400 text-white'>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-lg text-gray-900'>{user.username}</h1>
          </div>
        </div>
        <p className='text-gray-500 text-sm text-start flex-none'>Bio goes here...</p>

        <form onSubmit={createPostHandler}>
          <div className='border border-dashed border-gray-300 rounded-lg p-4 relative'>
            <input
              id='fileInput'
              type='file'
              accept='image/*,video/*'
              onChange={handleMediaChange}
              className='block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border file:rounded-lg file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200'
            />
            {media && (
              <div className='w-full mt-4 relative'>
                <div className='w-full h-64 bg-gray-200 flex items-center justify-center'>
                  <img
                    src={media}
                    alt='Preview'
                    className='object-cover w-full h-full rounded-lg'
                  />
                </div>
              </div>
            )}
          </div>

          <Textarea
            className='w-full resize-none border border-gray-300 rounded-lg p-3 focus:ring focus:ring-blue-300'
            placeholder='Write a caption...'
            rows='3'
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />

          <div className='flex justify-end gap-2'>
            <button
              onClick={() => setOpen(false)}
              className='px-4 mt-2 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors duration-300'
            >
              Cancel
            </button>
            <button
              className='bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-600'
              type='submit'
              disabled={loading}
            >
              {loading ? <Loader2 className='animate-spin h-5 w-5 text-white' /> : "Post"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default CreatePostDialog;
