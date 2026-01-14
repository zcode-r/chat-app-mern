import Message from "../models/message.model.js"
import Chat from "../models/chat.model.js"
import User from "../models/user.model.js"

export const sendmessage=async (req,res)=>{

        const {content,chatid}=req.body

        if(!content || !chatid){
            return res.status(400).json({message:"Invalid data passed"})
        }

        var newmessage={
            chat:chatid,
            content:content,
            sender:req.user._id
        }

    try{

        var message=await Message.create(newmessage)

        message=await message.populate("sender","name pic")
        message=await message.populate("chat")
        message=await User.populate(message,{
            path:"chat.users",
            select:"name pic email"
        })

        await Chat.findByIdAndUpdate(req.body.chatid,{
            lastmessage:message
        })

        res.json(message)
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}


export const allmessage=async (req,res)=>{
    try{

        const messages=await Message.find({chat:req.params.chatid})
            .populate("sender", "name pic email")
            .populate("chat")

        res.json(messages)
    }
    catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}


export const deletemsg=async (req,res)=>{
    try{
        const message=await Message.findById(req.params.messageid)

        if (!message) {
            return res.status(404).json({ message: "Message not found" })
        }

        if(message.sender.toString()!==req.user._id.toString()){
            return res.status(401).json({ message: "You can't delete other users' messages" })
        }

        await Message.findByIdAndDelete(req.params.messageid)

        res.json({ success: true, message: "Message Deleted" })
    }
    catch(error) {
        res.status(400);
        throw new Error(error.message);
    }
}