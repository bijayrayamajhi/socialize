import { Heart, Home, LogOut, MessageCircle, PlusSquare, TrendingUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setSuggestedUsers } from "./redux/authSlice";
import { useState } from "react";
import CreatePostDialog from "./CreatePostDialog";
import { setPosts, setSelectedPost } from "./redux/postSlice";
import { setSelectedUser } from "./redux/chatSlice";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "./ui/button";
import { setLikeDislikeNotification } from "./redux/realTimeNotification";

function LeftSidebar() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const { likeDislikeNotification } = useSelector((store) => store.realTimeNotification);

  const popoverCloseHandler = () => {
    dispatch(setLikeDislikeNotification([]));
  };
  const logoutHandler = async () => {
    try {
      const res = await axios.get("https://socialize-cpzw.onrender.com/api/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        dispatch(setSelectedPost(null));
        dispatch(setSuggestedUsers([]));
        dispatch(setSelectedUser(null));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const leftSidebarItemsHandler = (itemText) => {
    if (itemText === "Logout") {
      logoutHandler();
    } else if (itemText === "Create") {
      setOpen(true);
    } else if (itemText === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (itemText === "Home") {
      navigate("/");
    } else if (itemText === "Messages") {
      navigate("/chat");
    }
  };
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className='h-6 w-6'>
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <div className='top-0 left-0 flex flex-col h-screen gap-3 p-3 border-r border-gray-200  md:w-[16%] w-[80px] z-10 fixed'>
      <div className='text-start font-bold text-blue-600 italic flex justify-start'>
        SOCIALIZEE
      </div>

      {sidebarItems.map((item, index) => {
        return (
          <div
            key={index}
            className='flex gap-3 items-center hover:bg-gray-200 rounded-lg p-3 my-3 cursor-pointer relative w-full'
            onClick={() => leftSidebarItemsHandler(item.text)}
          >
            {item.icon}
            <span className='hidden md:block'>{item.text}</span>

            {item.text === "Notifications" && likeDislikeNotification.length > 0 && (
              <Popover
                onOpenChange={(isOpen) => {
                  if (!isOpen) {
                    popoverCloseHandler();
                  }
                }}
              >
                <PopoverTrigger>
                  <Button className='h-5 w-5 rounded-full bg-red-600  hover:bg-red-600'>
                    {likeDislikeNotification.length}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='z-50'>
                  <div className='flex flex-col gap-2'>
                    {likeDislikeNotification.map((notification) => {
                      return (
                        <div key={notification?.userDetails?._id}>
                          <div className='flex gap-2 items-center'>
                            <Avatar>
                              <AvatarImage
                                src={notification?.userDetails?.profilePicture}
                                alt='profile_picture'
                              />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <span className='font-bold'>
                              {notification.userDetails?.username}{" "}
                              <span className='font-normal'>liked your post</span>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        );
      })}

      <CreatePostDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftSidebar;
