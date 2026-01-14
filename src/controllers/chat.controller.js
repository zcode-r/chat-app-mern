import Chat from "../models/chat.model.js"
import User from "../models/user.model.js"

export const accesschat=async (req,res)=>{

    const {userid}=req.body

    if(!userid){
        return res.status(400).json({ message: "UserId param not sent with request" })
    }

    let ischat=await Chat.find({
        isgroupchat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userid}}}
        ]
    }).populate("users","-password").populate("lastmessage")

    ischat = await User.populate(ischat,{
        path:"lastmessage.sender",
        select:"name pic email"
    })

    if(ischat.length>0){
        res.send(ischat[0])
    }
    else{
        var chatdata = {
            chatname: "sender",
            isgroupchat: false,
            users: [req.user._id, userid],
        }

            try{
                const createchat= await Chat.create(chatdata)

                const fullchat=await Chat.findOne({_id:createchat._id}).populate("users","-password")

                res.status(200).json(fullchat)
            }
            catch (error) {
                res.status(400).json({ message: error.message });
            }
    }

}


export const fetchchat=async (req,res)=>{
    try{
        Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupadmin","-password")
        .populate("lastmessage")
        .sort({updatedAt:-1})
        .then(async(results)=>{

            results=await User.populate(results,{
                path:"lastmessage",
                select:"name pic email"
            })

            res.status(200).send(results)

        })
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}


export const creategroupchat=async (req,res)=>{

    if(!req.body.users || !req.body.name){
        return res.status(400).json({message:"Fill all the details"})
    }

    var users=JSON.parse(req.body.users)

    if (users.length < 2) {
        return res
        .status(400)
        .send("More than 2 users are required to form a group chat")
    }

    users.push(req.user)

    try{
        const groupchat=await Chat.create({
            chatname:req.body.name,
            isgroupchat:true,
            users:users,
            groupadmin:req.user
        })

        const fullgroupchat=await Chat.findOne({_id:groupchat._id}).populate("users","-password").populate("groupadmin","-password")

        res.status(200).json(fullgroupchat)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}


export const renamegroup=async (req,res)=>{
    try{
        const {chatid,chatname}=req.body

        const updatechat=await Chat.findByIdAndUpdate(chatid,{
            chatname:chatname,

        },{new:true}).populate("users","-password").populate('groupadmin',"-password")

        if(!updatechat){
            throw new Error("Chat not found")
        }
        else{
            res.json(updatechat)
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }

}


export const addppl=async (req,res)=>{
    try{
        const {chatid,userid}=req.body

        const add=await Chat.findByIdAndUpdate(chatid,{
            $push:{users:userid}
        },{new:true}).populate("users","-password").populate('groupadmin',"-password")

        if(!add){
            throw new Error("User not found")
        }
        else{
            res.json(add)
        }

    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}

export const rmppl=async (req,res)=>{
    try{
        const {chatid,userid}=req.body

        const rm=await Chat.findByIdAndUpdate(chatid,{
            $pull:{users:userid}
        },{new:true}).populate("users","-password").populate('groupadmin',"-password")

        if(!rm){
            throw new Error("User not found")
        }
        else{
            res.json(rm)
        }

    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
}