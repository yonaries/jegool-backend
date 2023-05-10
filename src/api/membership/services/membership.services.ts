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

export const getMembershipById = async (id: string) => {
 try {
  const membership = await prisma.membership.findUniqueOrThrow({
   where: {
    id: id,
   },
  });
  return membership;
 } catch (error) {
  throw error;
 }
};

export const updateMembershipById = async (id: string, membership: Membership) => {
 try {
  const updatedMembership = await prisma.membership.update({
   data: membership,
   where: {
    id: id,
   },
  });
  return updatedMembership;
 } catch (error) {
  throw error;
 }
};

export const deleteMembershipById = async (id: string): Promise<Membership | null> => {
 try {
  const deletedMembership = await prisma.membership.delete({
   where: {
    id: id,
   },
  });
  return deletedMembership;
 } catch (error) {
  throw error;
 }
};
