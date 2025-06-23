import mongoose from "mongoose";
const mediaSchema = new mongoose.Schema({
    chatId : {type: String, required:true},
    userId : {type: String, required:true},
    url : {type : String, required : true},
    isLiked : {type : Boolean,default:false},
    timestamp : {type : Date, default : Date.now}
});

export default mongoose.model.Media || mongoose.model("Media", mediaSchema);