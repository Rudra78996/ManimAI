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
import User from "./models/user.js";

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
      let user = await User.findOne({ userId });
      const now = new Date();
      if (!user) {
        user = await User.create({ userId });
      } else {
        const lastReset = new Date(user.lastQuotaReset);
        if (
          now.getUTCFullYear() !== lastReset.getUTCFullYear() ||
          now.getUTCMonth() !== lastReset.getUTCMonth() ||
          now.getUTCDate() !== lastReset.getUTCDate()
        ) {
          user.usedQuota = 0;
          user.lastQuotaReset = now;
        }
      }
      if (user.usedQuota >= user.dailyQuota) {
        socket.emit("newMessage", [{ role: "AI", content: "🚫 You have reached your free limit of 4 videos for today. Please come back tomorrow to generate more animations!", type: "error" }]);
        return;
      }
      user.usedQuota += 1;
      await user.save();

      await message.create({ chatId, userId, role: "USER", content: currentMessage });

      socket.emit("newMessage", [{ role: "USER", content: currentMessage }]);

      socket.emit("newMessage", [{ role: "AI", type: "loading", content: "⏳ Generating your animation... Please wait for the magic!" }]);

      const { data } = await axios.post(
        `${process.env.SERVER_URL}/generate-animation`,
        { prompt: currentMessage }
      );
      console.log(data);
      
      const videoURL = data.videoUrl;
      await Media.create({ chatId, userId, url: videoURL });

      const aiMsg = { role: "AI", content: `✨ Your animated video is ready!\n\n[▶️ View Animation](${videoURL})\n\nYou can also download or share this video!`, type: "video", videoUrl: videoURL };
      socket.emit("newMessage", [aiMsg]);

      await message.create({ chatId, userId, role: "AI", content: aiMsg.content });

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

