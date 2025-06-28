import express from "express";
import {requireAuth,  } from '@clerk/express'
import { allMessage, createChat, isValidChat, saveMessage, getAllMedia, getAllChats } from "../controllers/chatController.js";
import {chatValidator} from "../middleware/chatValidator.js";

const chatRouter = express.Router();
// console.log();

chatRouter.post("/create-chat", requireAuth(), createChat);
chatRouter.post("/is", requireAuth(), chatValidator, isValidChat);
chatRouter.post("/all-messages", requireAuth(), chatValidator, allMessage);
chatRouter.post("/all-media", requireAuth(), chatValidator, getAllMedia);
chatRouter.get("/all-chats", requireAuth(), getAllChats);

export default chatRouter;