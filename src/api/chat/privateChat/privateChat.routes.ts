import express from "express";
import PrivateChatController from "./privateChat.controller";

const router = express.Router();

router.post("/", PrivateChatController.createPrivateChat);
router.get("/:id", PrivateChatController.getPrivateChatById)
router.delete("/:id", PrivateChatController.deletePrivateChatById);

export default router;
