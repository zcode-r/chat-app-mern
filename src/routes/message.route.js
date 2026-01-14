import express from 'express'
import { protect } from '../middlewares/auth.middleware.js'
import { sendmessage , allmessage , deletemsg} from '../controllers/message.controller.js'

const router=express.Router()

router.route("/").post(protect,sendmessage)
router.route("/:chatid").get(protect,allmessage)
router.route("/:messageid").delete(protect,deletemsg)

export default router