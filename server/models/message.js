import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
    chatId : {type: String, required:true},
    userId : {type: String, required:true},
    role : {type: String, required:true},
    content : {type : String},
    isLiked : {type : Boolean,default:false},
    timestamp : {type : Date, default : Date.now}
});

export default mongoose.models.Message || mongoose.model("Message", messageSchema);