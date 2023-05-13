import { PrismaClient, PrivateChat } from "@prisma/client";

const prisma = new PrismaClient();

export const createPrivateChat = async (data: PrivateChat): Promise<PrivateChat | null> => {
 try {
  const chat = await prisma.chat.create({
   data: {
    PrivateChat: {
     create: data,
    },
   },
   select: {
    PrivateChat: true,
   },
  });

  return chat.PrivateChat;
 } catch (error) {
  throw error;
 }
};
