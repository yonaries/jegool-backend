import { Project, PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export const createProject = async (project: Project) => {
  const { visibleTo, ...rest } = project;

  try {
    const createdProject = await prisma.project.create({
      data: {
        ...rest,
        visibleTo: visibleTo as Prisma.JsonArray,
      },
      select: {
        id: true,
      },
    });
    return createdProject;
  } catch (error) {
    throw error;
  }
};
