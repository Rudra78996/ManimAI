import express from "express";
import {requireAuth,  } from '@clerk/express'
import { allMessage, createChat, isValidChat, saveMessage, getAllMedia, getAllChats, likeMedia, getAllUserMedia } from "../controllers/chatController.js";
import { chatValidator } from "../middleware/chatValidator.js";
import { sendContactMessage } from "../controllers/contactController.js";

const chatRouter = express.Router();
// console.log();

chatRouter.post("/create-chat", requireAuth(), createChat);
chatRouter.post("/is", requireAuth(), chatValidator, isValidChat);
chatRouter.post("/all-messages", requireAuth(), chatValidator, allMessage);
chatRouter.post("/all-media", requireAuth(), chatValidator, getAllMedia);
chatRouter.get("/all-chats", requireAuth(), getAllChats);
chatRouter.post("/like-media", requireAuth(), likeMedia);
chatRouter.post("/all-user-media", requireAuth(), getAllUserMedia);
chatRouter.post("/contact", sendContactMessage);

export default chatRouter;