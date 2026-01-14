import express from 'express'
import { protect } from '../middlewares/auth.middleware.js'
import { accesschat , fetchchat , creategroupchat , renamegroup , addppl , rmppl} from '../controllers/chat.controller.js'

const router=express.Router()

router.route("/").post(protect,accesschat)
                 .get(protect,fetchchat)
router.route("/group").post(protect,creategroupchat)
router.route("/rename").put(protect,renamegroup)
router.route("/groupadd").put(protect,addppl)
router.route("/groupremove").put(protect,rmppl)

export default router