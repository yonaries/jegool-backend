import express from "express";
import ProjectServices from "./services";
import { Project } from "@prisma/client";
import {
	validateCreateProject,
	validateProjectQuery,
} from "./project.validate";
import PageServices from "../page/services";
import { handlePrismaError } from "../utils/prismaErrorHandler.util";
import MembershipService from "../membership/services";
import { override } from "joi";
import cleanObject from "@/utils/cleanObject";

export default class ProjectController {
	static createProject = async (
		req: express.Request,
		res: express.Response,
	) => {
		const project: Project = req.body;

		try {
			const page = await PageServices.getPageById(project.pageId);
			if (!page) return res.status(404).json({ error: "Page not found" });

			const { error } = validateCreateProject(project);
			if (error) return res.status(400).json({ error: error.message });

			const createdProject = await ProjectServices.createProject(project);

			return res.status(201).json({ project: { ...createdProject } });
		} catch (error) {
			return handlePrismaError(res, error, "Project");
		}
	};

	static getProjectById = async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
			const { id } = req.params;

			if (id === "all") {
				const projects = await ProjectServices.getProjectsByQuery();
				return res.status(200).json({ projects: projects });
			}

			const project = await ProjectServices.getProjectById(id);
			return res.status(200).json({ project: project });
		} catch (error) {
			return handlePrismaError(res, error, "Project");
		}
	};

	static getProjects = async (req: express.Request, res: express.Response) => {
		try {
			switch (true) {
				case !!req.query.pageId:
					try {
						await PageServices.getPageById(req.query.pageId as string);
						const pageProjects = await ProjectServices.getProjectsByPageId(
							req.query.pageId as string,
						);
						return res.status(200).json({ projects: pageProjects });
					} catch (error) {
						throw error;
					}

				case !!req.query.membershipId:
					const membershipProjects =
						await ProjectServices.getProjectsByMembershipId(
							req.query.membershipId as string,
						);
					return res.status(200).json({ projects: membershipProjects });

				case !!Object.keys(req.body).length:
					const query = cleanObject(req.body);

					const { error } = validateProjectQuery(query);
					if (error) return res.status(400).json({ error: error.message });

					const projects = await ProjectServices.getProjectsByQuery(query);
					return res.status(200).json({ projects: projects });

				default:
					return res.status(403).json({ error: "Invalid query" });
			}
		} catch (error) {
			switch (true) {
				case error:
					return handlePrismaError(res, error, "Project");
			}
		}
	};
}
