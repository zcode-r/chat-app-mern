import mongoose from "mongoose"

const chat=new mongoose.Schema({
    chatname:{type:String,trim:true},
    isgroupchat:{type:Boolean,default:false},
    users:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    lastmessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Message"
    },
    groupadmin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

const Chat= mongoose.model("Chat",chat)

export default Chat