import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000;

// Resolve __dirname for ESM
const __dirname = path.resolve();

// Start the server
server.listen(port, () => {
  connectDB(); // Connect to the database
  console.log(`Server is running on port ${port}`);
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOption = {
  origin: process.env.URL,
  credentials: true,
};
app.use(cors(corsOption));

// RESTful APIs
app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/message", messageRoute);

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Catch-all route for SPA
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});
