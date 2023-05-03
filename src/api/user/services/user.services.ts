import { User, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createUserAccount = async (user: User): Promise<User> => {
  try {
    const createdUser = await prisma.user.create({
      data: user,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        displayName: true,
        profileImage: true,
        residence: true,
        status: true,
        createdAt: true,
        updatedAt: true,
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
    const users = prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error) {
    throw error;
  }
};
