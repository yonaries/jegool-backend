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
}
