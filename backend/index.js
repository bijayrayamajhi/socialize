import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";

import dotenv from "dotenv";
dotenv.config({});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  connectDB();
  console.log(`Server is running on port ${port}`);
});

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOption));

//global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

//restful apis
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/message", messageRoute);
