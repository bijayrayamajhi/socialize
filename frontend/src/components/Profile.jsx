import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser, setUserProfile } from "./redux/authSlice";
import useGetUserProfile from "@/hooks/useGetUserProfile";

function Profile() {
  const params = useParams();
  const userId = params.id;

  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState("posts");
  const dispatch = useDispatch();

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.includes(userProfile?._id);

  const handleFollow = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/user/followAndUnfollow/${id}`,
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
        `http://localhost:8080/api/user/followAndUnfollow/${id}`,
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
  let displayedPosts;
  if (activeTab === "posts") {
    displayedPosts = userProfile?.posts;
  } else if (activeTab === "saved") {
    displayedPosts = userProfile?.bookmarks;
  }

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <div className='flex items-center gap-10'>
        <Avatar className='w-32 h-32'>
          <AvatarImage
            src={userProfile?.profilePicture}
            alt='User profile image'
            className='w-32 h-32 rounded-full object-cover'
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <div className='flex-1'>
          <div className='flex items-center gap-4'>
            <h1 className='text-2xl font-bold'>{userProfile?.username}</h1>
            {isLoggedInUserProfile ? (
              <>
                <Link to='/account/edit'>
                  <Button
                    className='px-4 py-1 text-sm text-black bg-gray-100 rounded bg hover:bg-gray-200'
                    varient='secondary'
                  >
                    Edit Profile
                  </Button>
                </Link>

                <Button
                  className='px-4 py-1 text-sm text-black bg-gray-100 rounded bg hover:bg-gray-200'
                  varient='secondary'
                >
                  view Archieve
                </Button>
                <Button
                  className='px-4 py-1 text-sm text-black bg-gray-100 rounded bg hover:bg-gray-200'
                  varient='secondary'
                >
                  Ad tools
                </Button>
              </>
            ) : isFollowing ? (
              <>
                <Button
                  className='px-4 py-1 text-sm text-black bg-gray-100 rounded bg hover:bg-gray-200'
                  varient='secondary'
                  onClick={() => handleUnfollow(userProfile?._id)}
                >
                  Unfollow
                </Button>
                <Link to={"/chat"}>
                  <Button
                    className='px-4 py-1 text-sm text-black bg-gray-100 rounded bg hover:bg-gray-200'
                    varient='secondary'
                  >
                    Message
                  </Button>
                </Link>
              </>
            ) : (
              <Button
                onClick={() => handleFollow(userProfile?._id)}
                className='px-4 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded'
              >
                Follow
              </Button>
            )}
          </div>
          <p className='text-start mt-5 text-gray-600'>{userProfile?.bio}</p>

          <div className='flex gap-8 mt-4'>
            <div>
              <span className='font-bold'>{userProfile?.posts?.length || 0}</span> posts
            </div>
            <div>
              <span className='font-bold'>{userProfile?.followers?.length || 0}</span>{" "}
              followers
            </div>
            <div>
              <span className='font-bold'>{userProfile?.following?.length || 0}</span>{" "}
              following
            </div>
          </div>
        </div>
      </div>
      <div className='border-t border-gray-200 flex items-center justify-center gap-3 mt-10'>
        <div className='flex gap-4 mt-4 '>
          <p
            className={`cursor-pointer ${activeTab === "posts" ? "font-bold" : ""}`}
            onClick={() => handleActiveTab("posts")}
          >
            POSTS
          </p>
          {user._id === userProfile._id && (
            <p
              className={`cursor-pointer ${activeTab === "saved" ? "font-bold" : ""}`}
              onClick={() => handleActiveTab("saved")}
            >
              SAVED
            </p>
          )}
        </div>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {displayedPosts.map((post) => (
          <div
            key={post._id}
            className='relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 my-5'
          >
            <img
              src={post.image}
              alt='post image'
              className='rounded-lg aspect-square object-cover transform group-hover:scale-105 transition-transform duration-300'
            />
            <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <div className='flex items-center gap-6'>
                <button
                  className='flex items-center text-white text-lg font-semibold'
                  aria-label='Like post'
                >
                  <Heart className='w-6 h-6 mr-2' />
                  <span>{post?.likes?.length}</span>
                </button>
                <button
                  className='flex items-center text-white text-lg font-semibold'
                  aria-label='Comment on post'
                >
                  <MessageCircle className='w-6 h-6 mr-2' />
                  <span>{post?.comments?.length}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Profile;
