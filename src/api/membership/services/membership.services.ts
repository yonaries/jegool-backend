import { PrismaClient, Membership } from "@prisma/client";

const prisma = new PrismaClient();

export const createMembership = (membership: Membership) => {
  try {
    const newMembership = prisma.membership.create({
      data: membership,
      select: {
        id: true,
      },
    });
    return newMembership;
  } catch (error) {
    throw error;
  }
};

export const getMembershipById = async(id: string) => {
  try {
    const membership = await prisma.membership.findUnique({
      where: {
        id: id,
      },
    });
    return membership;
  } catch (error) {
    throw error;
  }
}
