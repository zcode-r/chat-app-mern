import mongoose from "mongoose"
import bcrypt from 'bcrypt'

const user=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    pic: {
      type: String,
      required: true,
      default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    resetpasswordtoken:String,
    resetpasswordexpire:Date
},{timestamps:true})

user.pre("save",async function () {
    if(!this.isModified("password")){
        return;
    }

    const salt=await bcrypt.genSalt(10)
    this.password= await bcrypt.hash(this.password,salt)
})

user.methods.matchpassword= async function (password) {
    return await bcrypt.compare(password,this.password)
}

const User= mongoose.model("User",user)

export default User