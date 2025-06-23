import express from "express";
import { clerkClient, requireAuth, getAuth } from '@clerk/express'
import { createChat, isValidChat } from "../controllers/chatController.js";
import {chatValidator} from "../middleware/chatValidator.js";

const chatRouter = express.Router();
// console.log();

chatRouter.post("/create-chat", requireAuth(), createChat);
chatRouter.post("/is", requireAuth(), chatValidator, isValidChat);

export default chatRouter;