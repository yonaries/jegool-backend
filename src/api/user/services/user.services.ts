import { PrismaError } from "../../../errors/prisma.error";
import { User, PrismaClient, SubscriptionStatus, Subscription } from "@prisma/client";

const prisma = new PrismaClient();

export const createUserAccount = async (user: User): Promise<{ id: string }> => {
 try {
  const createdUser = await prisma.user.create({
   data: user,
   select: {
    id: true,
   },
  });
  return createdUser;
 } catch (error) {
  throw error;
 }
};

export const getUserById = async (userId: string): Promise<User | null> => {
 try {
  const user = await prisma.user.findUnique({
   where: {
    id: userId,
   },
  });
  return user;
 } catch (error) {
  throw error;
 }
};

export const getUsers = async (): Promise<User[] | null> => {
 try {
  const users = await prisma.user.findMany({
   orderBy: {
    createdAt: "desc",
   },
  });
  return users;
 } catch (error) {
  throw error;
 }
};

export const updateUserById = async (userId: string, user: User): Promise<User | null> => {
 try {
  const updatedUser = await prisma.user.update({
   data: user,
   where: {
    id: userId,
   },
  });

  return updatedUser;
 } catch (error) {
  throw error;
 }
};

export const deleteUserById = async (userId: string): Promise<{ id: string } | null> => {
 try {
  const deletedUser = await prisma.user.delete({
   where: {
    id: userId,
   },
   select: {
    id: true,
   },
  });
  return deletedUser;
 } catch (error) {
  throw error;
 }
};

export const getUserSubscriptionsById = async (
 userId: string,
 statusQuery?: SubscriptionStatus,
): Promise<Subscription[]> => {
 const orderBy = {
  createdAt: "desc",
 };
 try {
  const subscription =
   statusQuery === null
    ? await prisma.user.findUniqueOrThrow({
       where: {
        id: userId,
       },
       include: {
        Subscription: {
         orderBy: {
          createdAt: "desc",
         },
        },
       },
      })
    : await prisma.user.findUniqueOrThrow({
       where: {
        id: userId,
       },
       include: {
        Subscription: {
         orderBy: {
          createdAt: "desc",
         },
         where: {
          status: statusQuery,
         },
        },
       },
      });

  return subscription.Subscription;
 } catch (error) {
  throw error;
 }
};
