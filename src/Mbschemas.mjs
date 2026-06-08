import mongoose from "mongoose";
const EmailSchema =new mongoose.Schema({
    subject:String,
    recipient:[String],
    status:String,
    sentAt:{type:Date,default:Date.now}
})
const usermailSchema = new mongoose.Schema({
    username:String,
    password:String
})
export const Emailrecord = mongoose.model("Emailrecord",EmailSchema)
export const user=mongoose.model("user",usermailSchema)
