import Chat from "../models/chat.js";
import { getAuth } from "@clerk/express";
import Message from "../models/message.js";

export const createChat = async (req, res) => {
    const { userId } = getAuth(req);
    try {
        const chat = new Chat({ userId });
        await chat.save();
        const message = new Message({chatId:chat._id, userId, role:"AI", content:"Hello! I'm ManimAI. Give me a topic or problem and I'll animate it for you!"});
        await message.save();
        return res.status(200).send({ chatId: chat._id });
    } catch (err) {
        console.error(err);
        return res.status(500).send("Error: " + err.message);
    }
}

export const isValidChat = async (req, res) => {
    
    try {
        return res.status(200).json({message:"valid"});
    }catch(e) {
        return res.status(500).send("Error: "+e.message);
    }
}