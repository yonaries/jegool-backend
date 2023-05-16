import { Request, Response } from "express";
import SocialLinkService from "./services";
import { validateSocialLink } from "./socialLink.validate";
import PageServices from "../page/services";

export default class SocialLinkController {
 static async createSocialLink(req: Request, res: Response) {
  const socialLink = req.body;
  try {
   const { error } = validateSocialLink(socialLink);
   if (error) return res.status(400).json({ error: error.message });

   const page = await PageServices.getPageById(socialLink.pageId);
   if (!page) return res.status(404).json({ error: "Page not found" });

   const createdSocialLink = await SocialLinkService.createSocialLink(socialLink);

   return res.status(201).json({ socialLink: createdSocialLink });
  } catch (error) {
   throw error;
  }
 }
}
