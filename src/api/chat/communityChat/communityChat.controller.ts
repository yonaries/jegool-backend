import { Request, Response } from "express";
import ChatServices from "../service";
import { PrismaError } from "../../../errors/prisma.error";
import { validateCommunityChat } from "./communityChat.validate";

export default class CommunityChatController {
 static async createCommunityChat(req: Request, res: Response) {
  const communityChat = req.body;
  try {
   const { error } = validateCommunityChat(communityChat);
   if (error) return res.status(400).json({ error: error.message });

   const newCommunityChat = await ChatServices.createCommunityChat(communityChat);
   res.status(201).json({ communityChat: newCommunityChat });
  } catch (error) {
   PrismaError(res, error);
  }
 }

 static async getCommunityChatById(req: Request, res: Response) {
  const { id } = req.params;
  if (!id || id.length === 0) return res.status(400).json({ error: "chatId is required" });
  try {
   const communityChat = await ChatServices.getCommunityChatById(id);
   if (!communityChat) return res.status(404).json({ error: "Community Chat Not Found" });
   return res.status(200).json({ communityChat });
  } catch (error) {
   PrismaError(res, error);
  }
 }
}
