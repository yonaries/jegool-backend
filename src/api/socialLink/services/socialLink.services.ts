import { PrismaClient, SocialLink } from ".prisma/client";

const prisma = new PrismaClient();

export const createSocialLink = async (data: SocialLink) => {
 try {
  const socialLink = await prisma.socialLink.create({
   data,
   select: {
    id: true,
   },
  });
  return socialLink;
 } catch (error) {
  throw error;
 }
};
