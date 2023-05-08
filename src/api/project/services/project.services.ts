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

export const getProjectById = async (id: string) => {
	try {
		const project = prisma.project.findUniqueOrThrow({
			where: {
				id: id,
			},
		});
		return project;
	} catch (error) {
		throw error;
	}
};

export const getProjectsByPageId = async (pageId: string) => {
	try {
		const projects = prisma.project.findMany({
			where: {
				pageId: {
					equals: pageId,
				},
			},
		});
		return projects;
	} catch (error) {
		throw error;
	}
};

export const getProjectsByMembershipId = async (membershipId: string) => {
	try {
		const project = prisma.project.findMany({
			where: {
				visibleTo: {
					array_contains: membershipId,
				},
			},
		});
		return project;
	} catch (error) {
		throw error;
	}
};

export const getProjectsByQuery = async (query?: Project) => {
	try {
		if (!query) {
			const projects = prisma.project.findMany();
			return projects;
		}
		const { visibleTo, ...rest } = query;

		const projects = prisma.project.findMany({
			where: {
				AND: [
					{
						...rest,
					},
				],
			},
		});
		return projects;
	} catch (error) {
		throw error;
	}
};
