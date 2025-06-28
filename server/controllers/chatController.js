import Chat from "../models/chat.js";
import { getAuth } from "@clerk/express";
import Message from "../models/message.js";
import message from "../models/message.js";
import Media from "../models/media.js";

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
export const allMessage = async (req, res) => {
    const { userId } = getAuth(req);
    const {chatId} = req.body;
    try {
        const chats = await message.find({chatId, userId});
        return res.status(200).send(chats);
    } catch (error) {
        return res.status(500).json({success:false, message:error.message});
    }
}
export const saveMessage = async (req, res) => {
  const { userId } = getAuth(req);
  const { chatId, content } = req.body;

  try {
    const message = new Message({ chatId, userId, role: "USER", content });
    await message.save();
    console.log("message saved");

    // Send immediate success response
    res.status(200).send({ success: true, message: "message saved successfully." });

    // Trigger animation request in background
    const response = await fetch("https://manim-ai-backend-wywd.onrender.com/generate-animation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: content })
    });

    const result = await response.text();
    console.log("Animation result:", result);
  } catch (err) {
    console.error("Server crash:", err);
    return res.status(500).send("Error: " + err.message);
  }
};

export const getAllMedia = async (req, res) => {
    const { chatId } = req.body;
    try {
        const media = await Media.find({ chatId }).sort({ timestamp: -1 });
        return res.status(200).json(media);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllChats = async (req, res) => {
    const { userId } = getAuth(req);
    try {
        const chats = await Chat.find({userId}).sort({ createdAt: -1 });
        
        const chatsTopic = await Promise.all(
            chats.map(async (chat)=>{
                const messages = await Message.find({ chatId: chat._id, userId }).sort({ _id: 1 });
                if(messages.length > 1) {
                    let topic = messages[1].content;
                    return {"topic" : topic.slice(0, Math.min(50, topic.length)), "chatId" : messages[1].chatId};
                }else {
                    return null;
                }
            })
        );
        const filteredTopic = chatsTopic.filter(Boolean);     
           
        return res.json(filteredTopic);
    }catch (err){
        return res.status(500).json({ error: "Something went wrong." });
    }
}