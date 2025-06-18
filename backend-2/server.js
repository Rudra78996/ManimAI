import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import morgan from "morgan";

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins = ["http://localhost:5173"]

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins,credentials : true}));
app.use(morgan("dev"));
// API Endpoints
app.get("/", (req, res)=>res.json({status:"server running"}));
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, ()=>console.log(`server running on PORT : ${port}`));