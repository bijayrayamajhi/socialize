import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST "],
  },
});

const userSocketMap = {}; //this is a object which map userId to the corresponding socket id {userId: socket.id}

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log(`user connected with userId: ${userId} and socketId: ${socket.id}`);
  }
  io.emit("getOnlineUsers", Object.keys(userSocketMap)); //returning userIds on this event

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`user disconnected with userId: ${userId} and socketId: ${socket.id}`);
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // updating data on event trigerring
  });
});

export { server, app, io };
