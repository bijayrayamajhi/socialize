import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";

const Comment = ({ comment }) => {
  return (
    <div>
      <div className='flex gap-2'>
        <Avatar className='w-10 h-10 rounded-full overflow-hidden'>
          <AvatarImage
            src={comment?.author?.profilePicture}
            alt='User profile image'
            className='w-full h-full object-cover'
          />
          <AvatarFallback className='bg-gray-400'>CN</AvatarFallback>
        </Avatar>
        <h1 className='font-bold'>
          {comment?.author?.username}
          &nbsp;&nbsp;
          <span className='font-normal'>{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default Comment;
