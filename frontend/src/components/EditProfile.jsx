import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setAuthUser } from "./redux/authSlice";

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) setInput({ ...input, profilePicture: file });
  };

  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  const editProfileHandler = async () => {
    console.log(input);
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePicture) formData.append("profilePicture", input.profilePicture);

    try {
      setLoading(true);
      const res = await axios.post(
        "https://socialize-cpzw.onrender.com/api/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const updatedUserData = {
          ...user,
          profilePicture: res.data.user?.profilePicture,
          bio: res.data.user?.bio,
          gender: res.data.user?.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='flex justify-center my-10 px-4'>
      <section className='max-w-3xl w-full bg-white shadow-md rounded-lg p-6'>
        <h1 className='font-bold text-2xl text-gray-800 mb-6'>Edit Profile</h1>

        <div className='flex items-center justify-between gap-4 bg-gray-100 p-4 rounded-lg shadow-sm mb-6 '>
          <div className='flex items-center gap-4'>
            <Avatar>
              <AvatarImage
                src={user?.profilePicture}
                alt='profile_picture'
                className='h-20 w-20 rounded-full object-cover'
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className='text-lg text-start font-semibold text-gray-800'>
                {user?.username}
              </h1>
              <span className='text-gray-600 text-sm'>
                {user?.bio || "Add your bio..."}
              </span>
            </div>
          </div>
          <input
            type='file'
            ref={imageRef}
            onChange={fileChangeHandler}
            className='hidden'
          />
          <button
            onClick={() => imageRef.current.click()}
            className='bg-[#0095F6] hover:bg-[#2776aa] rounded-md text-white px-4 py-2 font-medium transition-all duration-200'
          >
            Change Photo
          </button>
        </div>

        <div className='mb-6'>
          <h1 className='font-bold text-lg text-gray-800 mb-2 text-start'>Bio</h1>
          <Textarea
            name='bio'
            className='w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 p-3'
            placeholder={user?.bio || "Write a short bio about yourself..."}
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
          />
        </div>

        <div className='mb-6 flex flex-col'>
          <h1 className='font-bold text-lg text-gray-800 mb-2 text-start'>Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={(value) => selectChangeHandler(value)}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder={input.gender || "Select your gender"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value='male'>Male</SelectItem>
                <SelectItem value='female'>Female</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className='flex justify-end'>
          {loading ? (
            <Button className='bg-[#0095F6] hover:bg-[#2776aa] rounded-md text-white px-6 py-2 flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading
            </Button>
          ) : (
            <Button
              onClick={editProfileHandler}
              className='bg-[#0095F6] hover:bg-[#2776aa] rounded-md text-white px-6 py-2 font-medium transition-all duration-200'
            >
              Submit
            </Button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
