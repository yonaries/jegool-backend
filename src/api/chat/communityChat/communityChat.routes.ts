import express from "express";
import CommunityChatController from "./communityChat.controller";

const router = express.Router();

router.post("/", CommunityChatController.createCommunityChat);
router.get("/:id", CommunityChatController.getCommunityChatById);
router.delete("/:id", CommunityChatController.deleteCommunityChatById);

export default router;
