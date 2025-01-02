// hooks/useSocket.js
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch } from "react-redux";

import { setSocket } from "@/components/redux/socketSlice";
import { setOnlineUsers } from "@/components/redux/chatSlice";
import { setLikeDislikeNotification } from "@/components/redux/realTimeNotification";

const useSocket = (user) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io("http://localhost:8080", {
        query: { userId: user?._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notifications", (notification) => {
        dispatch(setLikeDislikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    }
  }, [user, dispatch]);
};

export default useSocket;
