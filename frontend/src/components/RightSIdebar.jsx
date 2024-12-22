import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

function RightSIdebar() {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className=' pr-32 my-10 w-fit'>
      <div className='flex gap-2'>
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage
              src={user?.profilePicture}
              alt='User profile image'
              className=' w-10 h-10 rounded-full overflow-hidden object-cover'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div>
          <h1 className='text-sm font-semibold text-start'>
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className='text-gray-600 text-sm'>{user?.bio || "bio here..."}</span>
        </div>
      </div>
      <div className='my-8 w-full'>
        <SuggestedUsers />
      </div>
    </div>
  );
}

export default RightSIdebar;
