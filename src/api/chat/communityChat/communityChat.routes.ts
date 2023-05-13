import express from "express";
import CommunityChatController from "./communityChat.controller";

const router = express.Router();

router.post("/", CommunityChatController.createCommunityChat);

export default router;
