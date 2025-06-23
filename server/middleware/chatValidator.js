import { getAuth } from "@clerk/express";
import chat from "../models/chat.js";

export const chatValidator = async (req, res, next) => {
    
    const {chatId}  = req.body;
    const {userId} = getAuth(req);
    if(!chatId || !userId) {
        return res.status(404).json({message : "Chat not Found"});
    }
    try {
        const requiredChat = await chat.findOne({_id:chatId, userId});
        if(!requiredChat) {
            return res.status(404).json({message : "Chat not Found"});
        }
        next();
    }catch(err) {
        return res.status(500).send({message : "Chat not Found"});
    }
}