import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "./redux/authSlice";
import { useState } from "react";
import CreatePostDialog from "./CreatePostDialog";

function LeftSidebar() {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
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
    }
  };
  const sidebarItems = [
    { icon: <Home />, text: "Home" },
    { icon: <Search />, text: "Search" },
    { icon: <TrendingUp />, text: "Explore" },
    { icon: <MessageCircle />, text: "Messages" },
    { icon: <Heart />, text: "Notifications" },
    { icon: <PlusSquare />, text: "Create" },
    {
      icon: (
        <Avatar className="h-6 w-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut />, text: "Logout" },
  ];
  return (
    <div className="top-0 left-0 flex flex-col h-screen gap-3 p-3 border-r border-gray-200  md:w-[16%] w-[80px] z-10 fixed">
      <div className="text-start font-bold">Logo</div>
      {sidebarItems.map((item, index) => {
        return (
          <div
            key={index}
            className="flex gap-3 items-center hover:bg-gray-200 rounded-lg p-3 my-3 cursor-pointer relative w-full"
            onClick={() => leftSidebarItemsHandler(item.text)}
          >
            {item.icon}
            <span className="hidden md:block">{item.text}</span>
          </div>
        );
      })}
      <CreatePostDialog open={open} setOpen={setOpen} />
    </div>
  );
}

export default LeftSidebar;
