import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useDispatch, useSelector } from "react-redux";
import Messages from "./Messages";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import { setMessages } from "./redux/chatSlice";

const MessageInbox = () => {
  const { selectedUser } = useSelector((store) => store.chat);
  const { onlineUsers } = useSelector((store) => store.chat);
  const isOnline = onlineUsers.includes(selectedUser?._id);
  const [message, setMessage] = useState("");
  const { messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://socialize-cpzw.onrender.com/api/message/send/${receiverId}`,
        { message },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setMessage("");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className='flex flex-col w-full'>
      {/* Header */}
      <div className='flex gap-2 '>
        <Avatar>
          <AvatarImage
            src={selectedUser?.profilePicture}
            alt='userProfile'
            className='h-10 w-10 rounded-full'
          />
          <AvatarFallback className='h-10 w-10 flex items-center justify-center bg-gray-300 text-white font-bold'>
            CN
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <h1 className='text-lg font-semibold text-start'>{selectedUser?.username}</h1>
          <span
            className={`text-xs font-semibold ${
              isOnline ? "text-green-600" : "text-red-500"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <hr className='mt-2' />
      {/* Chat Messages */}
      <Messages />

      {/* Message Input */}
      <div className='p-4 bg-gray-100 border-t border-gray-300 flex gap-3 w-full'>
        <input
          type='text'
          placeholder='Type your message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='flex-1 px-4 py-2 border rounded-full text-sm focus:outline-none focus:ring focus:ring-blue-300'
        />
        <button
          onClick={() => sendMessageHandler(selectedUser?._id)}
          className='bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition'
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default MessageInbox;
