import { Post, Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPost = async (post: Post, attachment?: any[]): Promise<{ id: string }> => {
 try {
  const { visibleTo, ...rest } = post;
  const createdPost = await prisma.post.create({
   data: {
    ...rest,
    visibleTo: visibleTo as Prisma.JsonArray,
    Attachment: {
     createMany: {
      data: attachment ? attachment : [],
     },
    },
   },
   select: {
    id: true,
   },
  });
  return createdPost;
 } catch (error) {
  throw error;
 }
};

export const deletePost = async (id: string): Promise<{ id: string }> => {
 try {
  const deletedPost = await prisma.post.delete({
   where: { id },
   select: {
    id: true,
   },
  });
  return deletedPost;
 } catch (error) {
  throw error;
 }
};

export const updatePost = async (id: string, post: Post, attachment?: any[]): Promise<{ id: string }> => {
 try {
  const { visibleTo, ...rest } = post;

  const updatedPost = await prisma.post.update({
   where: { id },
   data: {
    ...rest,
    visibleTo: visibleTo as Prisma.JsonArray,
    Attachment: {
     deleteMany: {
      postId: id,
     },
     createMany: {
      data: attachment ? attachment : [],
     },
    },
   },
   select: {
    id: true,
   },
  });
  return updatedPost;
 } catch (error) {
  throw error;
 }
};

export const getPostById = async (id: string): Promise<Post | null> => {
 try {
  const post = await prisma.post.findUniqueOrThrow({
   where: { id: id },
   include: {
    Attachment: true,
    page: {
     select: {
      id: true,
      name: true,
      profileImage: true,
     },
    },
   },
  });

  return post;
 } catch (error) {
  throw error;
 }
};

export const getPostsByPageId = async (pageId: string): Promise<Post[]> => {
 try {
  const posts = await prisma.post.findMany({
   where: { pageId },
   orderBy: {
    updatedAt: "desc",
   },
   include: {
    page: {
     select: {
      id: true,
      name: true,
      profileImage: true,
     },
    },
   },
  });
  return posts;
 } catch (error) {
  throw error;
 }
};

export const getAllPosts = async (): Promise<Post[]> => {
 try {
  const posts = await prisma.post.findMany({
   orderBy: {
    updatedAt: "desc",
   },
   include: {
    page: {
     select: {
      id: true,
      name: true,
      profileImage: true,
     },
    },
   },
  });
  return posts;
 } catch (error) {
  throw error;
 }
};

export const getPostsFilter = async (fields: Post): Promise<Post[]> => {
 try {
  const { visibleTo, ...rest } = fields;
  console.log("service:", visibleTo, rest);

  const posts = await prisma.post.findMany({
   where: {
    AND: [
     ...Object.entries(rest).map(([key, value]) => ({
      [key]: value,
     })),
     {
      visibleTo: {
       array_contains: visibleTo,
      },
     },
    ],
   },
   orderBy: {
    updatedAt: "desc",
   },
   include: {
    page: {
     select: {
      id: true,
      name: true,
      profileImage: true,
     },
    },
   },
  });
  return posts;
 } catch (error) {
  throw error;
 }
};

export const getPostsByMembershipId = async (membershipId: string): Promise<Post[]> => {
 try {
  const posts = await prisma.post.findMany({
   where: {
    visibleTo: {
     array_contains: membershipId,
    },
   },
   orderBy: {
    updatedAt: "desc",
   },
   include: {
    page: {
     select: {
      id: true,
      name: true,
      profileImage: true,
     },
    },
   },
  });
  return posts;
 } catch (error) {
  throw error;
 }
};

export const getPostsByMembershipIdAndPageId = async (membershipId: string, pageId: string): Promise<Post[]> => {
 try {
  const posts = await prisma.post.findMany({
   where: {
    visibleTo: {
     array_contains: membershipId,
    },
    pageId,
   },
   orderBy: {
    updatedAt: "desc",
   },
   include: {
    page: {
     select: {
      id: true,
      name: true,
      profileImage: true,
     },
    },
   },
  });
  return posts;
 } catch (error) {
  throw error;
 }
};

export const getUserFeedPosts = async (uid: string): Promise<Post[]> => {
 try {
  const subscriptions = await prisma.subscription.findMany({
   where: {
    subscriberId: uid,
   },
  });

  const membershipId = subscriptions.map((subscription) => subscription.membershipId);

  const posts = await prisma.post.findMany({
   where: {
    visibleTo: {
     array_contains: membershipId,
    },
   },
   orderBy: {
    updatedAt: "desc",
   },
   include: {
    page: {
     select: {
      id: true,
      name: true,
      profileImage: true,
     },
    },
   },
  });
  return posts;
 } catch (error) {
  throw error;
 }
};

export const getSubscribedPosts = async (uid: string, pageId: string): Promise<Post[]> => {
 try {
  const subscription = await prisma.subscription.findFirstOrThrow({
   where: {
    subscriberId: uid,
    membership: {
     pageId: pageId,
    },
   },
  });

  const membershipId = subscription.membershipId;

  const posts = await prisma.post.findMany({
   where: {
    visibleTo: {
     array_contains: membershipId,
    },
    pageId,
   },
   orderBy: {
    updatedAt: "desc",
   },
   include: {
    page: {
     select: {
      id: true,
      name: true,
      profileImage: true,
     },
    },
   },
  });
  return posts;
 } catch (error) {
  throw error;
 }
};
