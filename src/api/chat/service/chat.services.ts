import { Chat, CommunityChat, PrismaClient, PrivateChat } from "@prisma/client";

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

export const getPrivateChatById = async (chatId: string): Promise<PrivateChat | null> => {
 try {
  const chat = await prisma.chat.findUniqueOrThrow({
   where: {
    id: chatId,
   },
   include: {
    PrivateChat: true,
   },
  });

  return chat.PrivateChat;
 } catch (error) {
  throw error;
 }
};

export const deletePrivateChatById = async (chatId: string): Promise<PrivateChat | null> => {
 try {
  const chat = await prisma.chat.delete({
   where: {
    id: chatId,
   },
   include: {
    PrivateChat: true,
   },
  });

  return chat.PrivateChat;
 } catch (error) {
  throw error;
 }
};

export const deleteCommunityChatById = async (chatId: string): Promise<CommunityChat | null> => {
 try {
  const chat = await prisma.chat.delete({
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

export const getPrivateChatsByUserId = async (userId: string): Promise<{
    chatId: string;
    user1Id: string | null | undefined;
    user2Id: string | null | undefined;
    createdAt: Date;
}[] | null> => {
 try {
  const chats = await prisma.chat.findMany({
   where: {
    PrivateChat: {
     OR: [
      {
       user1Id: userId,
      },
      {
       user2Id: userId,
      },
     ],
    },
   },
   select: {
    id: true,
    createdAt: true,
    PrivateChat: {
     select: {
      user1Id: true,
      user2Id: true,
     },
    },
   },
  });

  const filteredPrivateChats = chats.map((chat) => {
   return {
    chatId: chat.id,
    user1Id: chat.PrivateChat?.user1Id,
    user2Id: chat.PrivateChat?.user2Id,
    createdAt: chat.createdAt,
   };
  });

  return filteredPrivateChats;
 } catch (error) {
  throw error;
 }
};
