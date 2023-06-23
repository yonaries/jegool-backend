import {
 ContentType,
 Goal,
 Membership,
 Page,
 Post,
 PostStatus,
 Prisma,
 PrismaClient,
 Project,
 SocialLink,
} from "@prisma/client";

const prisma = new PrismaClient();

export const createPage = async (page: Page): Promise<{ id: string }> => {
 try {
  const createdPage = await prisma.page.create({
   data: page,
   select: {
    id: true,
   },
  });
  return createdPage;
 } catch (error) {
  throw error;
 }
};

export const updatePage = async (id: string, page: Page): Promise<{ id: string }> => {
 try {
  const updatedPage = await prisma.page.update({
   where: {
    id: id,
   },
   data: page,
   select: {
    id: true,
   },
  });
  return updatedPage;
 } catch (error) {
  throw error;
 }
};

export const deletePage = async (id: string): Promise<{ id: string }> => {
 try {
  const deletedPage = await prisma.page.delete({
   where: {
    id: id,
   },
   select: {
    id: true,
   },
  });
  return deletedPage;
 } catch (error) {
  throw error;
 }
};

export const getPageById = async (id: string): Promise<Page | null> => {
 try {
  const page = await prisma.page.findUniqueOrThrow({
   where: {
    id: id,
   },
   include: {
    CommunityChat: true,
    BankAccount: true,
    Donation: true,
    Membership: true,
    Goal: true,
    SocialLink: true,
    Post: true,
    Project: true,
   },
  });

  return page;
 } catch (error) {
  throw error;
 }
};

export const getPageByUserId = async (id: string): Promise<Page | null> => {
 try {
  const page = await prisma.page.findUniqueOrThrow({
   where: {
    ownerId: id,
   },
   include: {
    CommunityChat: true,
    BankAccount: true,
    Donation: true,
    Membership: true,
    Goal: true,
    SocialLink: true,
    Post: true,
    Project: true,
   },
  });

  return page;
 } catch (error) {
  throw error;
 }
};

export const getAllPages = async (): Promise<Page[] | null> => {
 try {
  const pages = await prisma.page.findMany({
   orderBy: {
    createdAt: "desc",
   },
  });
  return pages;
 } catch (error) {
  throw error;
 }
};

export const getPageMemberShips = async (id: string): Promise<Membership[]> => {
 try {
  const page = await prisma.page.findUniqueOrThrow({
   where: {
    id: id,
   },
   include: {
    Membership: {
     orderBy: {
      createdAt: "desc",
     },
    },
   },
  });
  return page.Membership;
 } catch (error) {
  throw error;
 }
};

export const getPagePosts = async (
 id: string,
 query?: {
  type: ContentType | undefined;
  status: PostStatus | undefined;
  visibleTo: string | undefined;
 },
): Promise<Post[]> => {
 try {
  const page =
   query === null
    ? await prisma.page.findUniqueOrThrow({
       where: {
        id: id,
       },
       include: {
        Post: {
         orderBy: {
          createdAt: "desc",
         },
        },
       },
      })
    : await prisma.page.findUniqueOrThrow({
       where: {
        id: id,
       },
       include: {
        Post: {
         orderBy: {
          createdAt: "desc",
         },
         where: {
          status: query?.status,
          type: query?.type,
          visibleTo: {
           array_contains: query?.visibleTo,
          },
         },
        },
       },
      });
  return page.Post;
 } catch (error) {
  throw error;
 }
};

export const getPageProjects = async (
 id: string,
 query?: {
  status: PostStatus | undefined;
  visibleTo: string | undefined;
 },
): Promise<Project[]> => {
 try {
  const page =
   query === null
    ? await prisma.page.findUniqueOrThrow({
       where: {
        id: id,
       },
       include: {
        Project: {
         orderBy: {
          createdAt: "desc",
         },
        },
       },
      })
    : await prisma.page.findUniqueOrThrow({
       where: {
        id: id,
       },
       include: {
        Project: {
         orderBy: {
          createdAt: "desc",
         },
         where: {
          status: query?.status,
          visibleTo: {
           array_contains: query?.visibleTo,
          },
         },
        },
       },
      });
  return page.Project;
 } catch (error) {
  throw error;
 }
};

export const getPageGoals = async (id: string): Promise<Goal[]> => {
 try {
  const page = await prisma.page.findUniqueOrThrow({
   where: {
    id: id,
   },
   select: {
    Goal: true,
   },
  });
  return page.Goal;
 } catch (error) {
  throw error;
 }
};

export const getPageSocialLinks = async (id: string): Promise<SocialLink[]> => {
 try {
  const page = await prisma.page.findUniqueOrThrow({
   where: {
    id: id,
   },
   select: {
    SocialLink: true,
   },
  });
  return page.SocialLink;
 } catch (error) {
  throw error;
 }
};

export const getPageByURL = async (url: string): Promise<Page | null> => {
 try {
  const page = await prisma.page.findUniqueOrThrow({
   where: {
    url: url,
   },
   include: {
    CommunityChat: true,
    BankAccount: true,
    Donation: true,
    Membership: true,
    Goal: true,
    SocialLink: true,
   },
  });

  return page;
 } catch (error) {
  throw error;
 }
};

export const searchPages = async (query: string): Promise<Page[]> => {
 try {
  const pages = await prisma.page.findMany({
   where: {
    OR: [
     {
      name: {
       search: query,
      },
     },
     {
      description: {
       search: query,
      },
     },
     {
      url: {
       search: query,
      },
     },
    ],
   },
  });
  return pages;
 } catch (error) {
  throw error;
 }
};
