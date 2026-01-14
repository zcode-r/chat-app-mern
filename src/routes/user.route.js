import express from 'express'
import { protect } from '../middlewares/auth.middleware.js';
import { register,authuser,allUsers,forgotpassword,resetpassword,updateuser} from '../controllers/user.controller.js'

const router=express.Router()

router.route("/").post(register).get(protect, allUsers)
router.post("/login", authuser)
router.post("/forgotpassword", forgotpassword)
router.put("/resetpassword/:resettoken", resetpassword)
router.route("/profile").put(protect, updateuser)
export default router