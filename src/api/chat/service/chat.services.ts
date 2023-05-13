import { CommunityChat, PrismaClient, PrivateChat } from "@prisma/client";

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

export const createCommunityChat = async (data: CommunityChat): Promise<CommunityChat | null> => {
 try {
  const chat = await prisma.chat.create({
   data: {
    CommunityChat: {
     create: data,
    },
   },
   select: {
    CommunityChat: true,
   },
  });

  return chat.CommunityChat;
 } catch (error) {
  throw error;
 }
};

export const getCommunityChatById = async (chatId: string): Promise<CommunityChat | null> => {
 try {
  const chat = await prisma.chat.findUniqueOrThrow({
   where: {
    id: chatId,
   },
   include: {
    CommunityChat: true,
   },
  });

  return chat.CommunityChat;
 } catch (error) {
  throw error;
 }
};
