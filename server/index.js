import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import connectDB from "./config/mongoDB.js"
import { clerkMiddleware } from '@clerk/express'
import { clerkClient, requireAuth, getAuth } from '@clerk/express'
import chatRouter from "./routes/chatRoutes.js";

const port = process.env.PORT || 3000;

const allowedOrigins = ["http://localhost:5173"];

const app = express();

app.use(express.json());
app.use(express.json({ allowEmptyBody: true}));
app.use(cors({origin:allowedOrigins, credentials : true}));
app.use(morgan("dev"));
// app.use(clerkMiddleware())

connectDB();

// API Endpoints
app.get("/", (req, res)=>res.json({status:"server running"}));
app.get("/private", requireAuth(), async (req, res)=>{
         const { userId } = getAuth(req)
         const user = await clerkClient.users.getUser(userId)
    
        return res.json({ user })
    })
app.use("/api/chat", chatRouter);

app.listen(port, ()=>{
    console.log("Server running on port "+port);
})