import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import useGetAllMessages from "@/hooks/useGetAllMessages";

const Messages = () => {
  useGetAllMessages();
  const { messages } = useSelector((store) => store.chat);
  const { selectedUser } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);
  return (
    <div className='flex flex-col flex-1 overflow-y-auto '>
      <div className='flex flex-col mx-auto mt-4 '>
        <div className='flex gap-2'>
          <Avatar>
            <AvatarImage
              className='h-16 w-16 rounded-full'
              src={selectedUser?.profilePicture}
              alt='profilePicture'
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <h1 className='text-xl font-bold flex items-center'>
            {selectedUser?.username}
          </h1>
        </div>
        <div className='text-start mt-2'>
          <Link to={`/profile/${selectedUser?._id}`}>
            {" "}
            <Button className='h-10 w-32' variant='secondary'>
              {" "}
              View Profile
            </Button>
          </Link>
        </div>
      </div>
      <div className='flex flex-col items-start mt-4 mb-4 gap-4'>
        {messages &&
          messages.map((msg) => {
            const isUserMessage = msg.senderId === user?._id;
            return (
              <div
                key={msg._id}
                className={`flex ${
                  isUserMessage ? "justify-end" : "justify-start"
                } w-full`}
              >
                <div
                  className={`p-3 rounded-xl max-w-sm shadow-lg ${
                    isUserMessage
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
