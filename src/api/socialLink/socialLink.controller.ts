import { Request, Response } from "express";
import SocialLinkService from "./services";
import { validateSocialLink, validateSocialLinkOnUpdate } from "./socialLink.validate";
import PageServices from "../page/services";
import { PrismaError } from "../../errors/prisma.error";

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
   return PrismaError(res, error);
  }
 }

 static async updateSocialLinkById(req: Request, res: Response) {
	  const { id } = req.params;
  const socialLink = req.body;

  if (id.length === 0 || !id) return res.status(400).json({ error: "SocialLink Id Is Required" });

  try {
   const { error } = validateSocialLinkOnUpdate(socialLink);
   if (error) return res.status(400).json({ error: error.message });

   const updatedSocialLink = await SocialLinkService.updateSocialLinkById(id, socialLink);

   return res.status(200).json({ socialLink: updatedSocialLink });
  } catch (error) {
   return PrismaError(res, error);
  }
 }
}
