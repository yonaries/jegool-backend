import express from "express";
import SocialLinkController from "./socialLink.controller";

const router = express.Router();

router.post("/", SocialLinkController.createSocialLink);
router.put("/:id", SocialLinkController.updateSocialLinkById);
router.delete("/:id", SocialLinkController.deleteSocialLinkById);
router.get("/:id", SocialLinkController.getSocialLinkById);

export default router;
