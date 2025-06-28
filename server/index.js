import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import connectDB from "./config/mongoDB.js";
import http from "http";
import { Server } from "socket.io";
import axios from "axios";
import message from "./models/message.js";
import Media from "./models/media.js";
import chatRouter from "./routes/chatRoutes.js";

const port = process.env.PORT || 3000;
const allowedOrigins = [process.env.FRONTEND_URL];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("userMessage", async ({ currentMessage, userId, chatId }) => {
    try {
      await message.create({ chatId, userId, role: "USER", content: currentMessage });

      socket.emit("newMessage", [{ role: "USER", content: currentMessage }]);

      socket.emit("newMessage", [{ role: "AI", type: "loading", content: "" }]);

      const { data } = await axios.post(
        "https://manim-ai-backend-wywd.onrender.com/generate-animation",
        { prompt: currentMessage }
      );
      console.log(data);
      
      const videoURL = data.videoUrl;
      await Media.create({ chatId, userId, url: videoURL });

      const aiMsg = { role: "AI", content: videoURL, type: "video" };
      socket.emit("newMessage", [aiMsg]);

      await message.create({ chatId, userId, role: "AI", content: videoURL });

    } catch (err) {
      console.error("Animation generation failed:", err);
      const errorMsg = { role: "AI", content: "Animation generation failed. Please try again." };
      socket.emit("newMessage", [errorMsg]);
      await message.create({ chatId, userId, role: "AI", content: errorMsg.content });
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

app.use(express.json());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(morgan("dev"));

connectDB();
app.use("/api/chat", chatRouter);
app.get("/", (req, res) => res.json({ status: "server running" }));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

