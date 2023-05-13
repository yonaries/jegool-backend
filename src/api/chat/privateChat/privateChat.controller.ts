import { Request, Response } from "express";
import { validatePrivateChat } from "./privateChat.validate";
import ChatServices from "../service";
import { PrismaError } from "../../../errors/prisma.error";

export default class PrivateChatController {
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

 static async getPrivateChatById(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) {
   return res.status(400).json({ error: "Private Chat Id Is Required" });
  }

  try {
   const privateChat = await ChatServices.getPrivateChatById(id);
   if (!privateChat) return res.status(404).json({ error: "Private Chat Not Found" });
   return res.status(200).json({ privateChat });
  } catch (error) {
   PrismaError(res, error);
  }
 }
}
