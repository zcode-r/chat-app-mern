import User from "../models/user.model.js"
import generatetoken from "../utlis/generatetoken.js"
import { sendmail } from "../utlis/email.js"
import crypto from 'crypto'

export const register=async (req,res)=>{

    try{
        const {name,password,email}=req.body

        if(!name || !password || !email){
            return res.status(400).json({message:"Fill all the details"})
        }

        const userexist=await User.findOne({email})

        if(userexist){
            return res.status(400).json({ message: "User already exists" })
        }

        const user=await User.create({
            name,password,email
        })

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
            })
        }
        else{
            res.status(400).json({ message: "Invalid user data" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}

export const authuser=async (req,res)=>{
    try{
        const {email,password}=req.body

        const user=await User.findOne({email})

        if(user && (user.matchpassword(password))){
            res.status(200).json({
                id:user._id,
                name:user.name,
                email:user.email,
                pic:user.pic,
                token:generatetoken(user._id)
            })
        }
        else{
            return res.status(400).json({message:"Invalid email or password"})
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: "Server Error" })
    }
}


export const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  
  res.send(users);
};

export const forgotpassword=async (req,res)=>{
    
    const {email}=req.body

    const user=await User.findOne({email})

    if(!user){
        return res.status(404).json({ message: "User not found" })
    }

    const resettoken=crypto.randomBytes(20).toString("hex")

    user.resetpasswordtoken=crypto.createHash("sha256").update(resettoken).digest("hex")
    user.resetpasswordexpire=Date.now()+10*60*1000

    await user.save()

    const resetUrl = `http://localhost:3000/resetpassword/${resettoken}`;

    const message = `<h1>You have requested a password reset</h1>
                     <p>Please go to this link to reset your password:</p>
                     <a href=${resetUrl} clicktracking=off>${resetUrl}</a>`

    try{
        await sendmail(user.email,"Password reset request",message)
        res.status(200).json({ success: true, data: "Email Sent" })
    }
    catch (error) {
        user.resetpasswordtoken = undefined;
        user.resetpasswordexpire = undefined;
        await user.save();
        return res.status(500).json({ message: "Email could not be sent" });
    }
}

export const resetpassword=async (req,res)=>{
    
    const resettoken=crypto.createHash("sha256").update(req.params.resettoken).digest("hex")

    const user=await User.findOne({
        resetpasswordtoken:resettoken,
        resetpasswordexpire:{$gt:Date.now()}
    })

    if (!user) {
        return res.status(400).json({ message: "Invalid Token or Token Expired" })
    }

    user.password=req.body.password

    await user.save()

    res.status(200).json({ success: true, data: "Password Updated Success" })
}

export const updateuser=async (req,res)=>{

    const user=await User.findById(req.user._id)

    if(user){
        user.name=req.body.name || user.name
        user.pic=req.body.pic || user.pic

        const update=await user.save()

        res.json({
            _id: update._id,
            name: update.name,
            email: update.email,
            pic: update.pic,
            token: req.headers.authorization.split(" ")[1], 
        });
    }
    else{
        res.status(404);
        throw new Error("User not found");
    }

}