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

export const updateSocialLinkById = async (id: string, data: SocialLink) => {
 try {
  const socialLink = await prisma.socialLink.update({
   where: {
    id,
   },
   data,
  });
  return socialLink;
 } catch (error) {
  throw error;
 }
};

export const deleteSocialLinkById = async (id: string) => {
 try {
  const socialLink = await prisma.socialLink.delete({
   where: {
    id,
   },
  });
  return socialLink;
 } catch (error) {
  throw error;
 }
};

export const getSocialLinkById = async (id: string) => {
 try {
  const socialLink = await prisma.socialLink.findFirstOrThrow({
   where: {
    id,
   },
  });
  return socialLink;
 } catch (error) {
  throw error;
 }
};
