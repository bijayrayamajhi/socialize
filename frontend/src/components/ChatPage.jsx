import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "./redux/chatSlice";
import MessageInbox from "./MessageInbox";
import { MessageCircleCode } from "lucide-react";
import { useEffect } from "react";

const ChatPage = () => {
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const { selectedUser } = useSelector((store) => store.chat);
  const { onlineUsers } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  //cleanup selectedUser when user navigate to other page
  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className='flex h-[90vh] bg-gray-100 mt-5'>
      {/* Sidebar */}
      <aside className='w-1/4 bg-white shadow-md flex flex-col p-4'>
        {/* Current User */}
        <div className='flex items-center gap-3 mb-6'>
          <Avatar>
            <AvatarImage
              src={user?.profilePicture}
              alt='userProfile'
              className='h-16 w-16 rounded-full'
            />
            <AvatarFallback className='h-16 w-16 flex items-center justify-center bg-gray-300 text-white font-bold'>
              CN
            </AvatarFallback>
          </Avatar>
          <h1 className='font-bold text-lg'>{user?.username}</h1>
        </div>

        <hr className='mb-4 border-gray-300' />

        {/* Suggested Users */}
        <div className='flex flex-col gap-3 overflow-y-auto'>
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id);
            return (
              <div
                key={suggestedUser._id}
                className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors'
                onClick={() => dispatch(setSelectedUser(suggestedUser))}
              >
                <Avatar>
                  <AvatarImage
                    src={suggestedUser?.profilePicture}
                    alt='userProfile'
                    className='h-10 w-10 rounded-full'
                  />
                  <AvatarFallback className='h-10 w-10 flex items-center justify-center bg-gray-300 text-white font-bold'>
                    CN
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <h2 className='font-medium text-sm'>{suggestedUser?.username}</h2>
                  <span
                    className={`text-xs font-semibold ${
                      isOnline ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Section */}
      <main className='flex-1 flex bg-gray-50 p-4'>
        {selectedUser ? (
          <MessageInbox />
        ) : (
          <div className='flex flex-col items-center justify-center w-full'>
            <MessageCircleCode className='h-32 w-32' />
            <h1 className='text-2xl font-bold text-gray-700 mb-2'>Welcome!</h1>
            <p className='text-sm text-gray-500'>
              Select a user from the sidebar to start chatting.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatPage;
