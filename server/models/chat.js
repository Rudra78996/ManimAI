import mongoose, { mongo } from "mongoose";
const { Schema } = mongoose;

const chatSchema = new Schema({
    userId : {
        type : String, required : true
    }, 
    createdAt : {
        type : Date, default:Date.now
    }
});
export default mongoose.models.Chat || mongoose.model("Chat", chatSchema);