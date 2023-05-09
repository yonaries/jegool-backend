import { PrismaClient, Subscription, SubscriptionStatus } from "@prisma/client";
import dayjs from "dayjs";

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

export const getSubscriptionById = async (
  id: string
): Promise<Subscription | null> => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: {
        id,
      },
    });
    return subscription;
  } catch (error) {
    throw error;
  }
};

export const deleteSubscriptionById = async (
  id: string
): Promise<Subscription | null> => {
  try {
    const subscription = await prisma.subscription.delete({
      where: {
        id,
      },
    });
    return subscription;
  } catch (error) {
    throw error;
  }
};

export const updateSubscriptionById = async (
  id: string,
  data: {
    status: SubscriptionStatus;
    expiryDate: string;
  } = {
    status: "INACTIVE",
    expiryDate: dayjs().toISOString(),
  }
) => {
  try {
    const subscription = await prisma.subscription.update({
      where: {
        id: id,
      },
      data: {
        expiryDate: data.expiryDate,
        status: data.status,
      },
    });
    return subscription;
  } catch (error) {
    throw error;
  }
};
