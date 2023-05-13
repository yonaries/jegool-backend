import { Request, Response } from "express";
import { validatePrivateChat } from "./privateChat.validate";
import ChatServices from "../service";
import { PrismaError } from "../../../errors/prisma.error";

export default class privateChatController {
 static async createPrivateChat(req: Request, res: Response) {
  const privateChat = req.body;
  try {
   const { error } = validatePrivateChat(privateChat);
   if (error) return res.status(400).json({ error: error.message });

   const newPrivateChat = await ChatServices.createPrivateChat(privateChat);
   res.status(201).json({ privateChat: newPrivateChat });
  } catch (error) {
   PrismaError(res, error);
  }
 }
}
