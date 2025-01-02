import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((store) => store.auth);

  return (
    <div>
      <hr />
      <div className='flex gap-5  my-3'>
        <h1 className='text-sm '>Suggested for you</h1>
        <h1 className='font-semibold text-sm cursor-pointer'>See all</h1>
      </div>
      <div className='flex flex-col gap-3'>
        {suggestedUsers.map((singleUser) => (
          <div className='flex gap-2' key={singleUser?._id}>
            <Link to={`/profile/${singleUser?._id}`}>
              <Avatar>
                <AvatarImage
                  src={singleUser?.profilePicture}
                  alt='User profile image'
                  className='w-10 h-10 rounded-full overflow-hidden object-cover'
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>

            <div>
              <h1 className='text-sm font-semibold text-start'>
                <Link to={`/profile/${singleUser?._id}`}>{singleUser?.username}</Link>
              </h1>

              <span className='text-gray-600 text-sm text-start'>
                {singleUser?.bio || ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuggestedUsers;
