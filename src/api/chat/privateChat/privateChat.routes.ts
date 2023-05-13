import express from "express";
import PrivateChatController from "./privateChat.controller";

const router = express.Router();

router.post("/", PrivateChatController.createPrivateChat);

export default router;
