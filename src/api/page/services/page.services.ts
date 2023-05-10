import { Page, PrismaClient } from "@prisma/client";

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
