import { PrismaClient, Subscription } from "@prisma/client";

const prisma = new PrismaClient();

export const createSubscription = async (
  data: Subscription
): Promise<{ id: string } | null> => {
  try {
    const subscription = await prisma.subscription.create({
      data,
      select: {
        id: true,
      },
    });
    return subscription;
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionByUserIdAndMembershipId = async (
  membershipId: string,
  subscriberId: string
) => {
  try {
    const subscription = await prisma.subscription.findFirst({
      where: {
        membershipId,
        subscriberId,
      },
    });
    return subscription;
  } catch (error) {
    throw error;
  }
};
