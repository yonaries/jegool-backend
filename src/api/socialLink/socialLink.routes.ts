import express from "express";
import SocialLinkController from "./socialLink.controller";

const router = express.Router();

router.post("/", SocialLinkController.createSocialLink);

export default router;
