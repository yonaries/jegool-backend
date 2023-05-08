import { Project } from "@prisma/client";
import express from "express";
import cleanObject from "../../utils/cleanObject";
import MembershipService from "../membership/services";
import PageServices from "../page/services";
import { PrismaError } from "../../errors/prisma.error";
import {
	validateCreateProject,
	validateProjectQuery,
} from "./project.validate";
import ProjectServices from "./services";

export default class ProjectController {
	static createProject = async (
		req: express.Request,
		res: express.Response,
	) => {
		const project: Project = req.body;

		try {
			const { error } = validateCreateProject(project);
			if (error) return res.status(400).json({ error: error.message });

			// await PageServices.getPageById(project.pageId);

			const createdProject = await ProjectServices.createProject(project);
			return res.status(201).json({ project: { ...createdProject } });
		} catch (error) {
			return PrismaError(res, error);
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
			return PrismaError(res, error);
		}
	};

	// TODO: Refactor this function
	static getProjects = async (req: express.Request, res: express.Response) => {
		switch (true) {
			case !!req.query.pageId:
				try {
					await PageServices.getPageById(req.query.pageId as string);
					const pageProjects = await ProjectServices.getProjectsByPageId(
						req.query.pageId as string,
					);
					return res.status(200).json({ projects: pageProjects });
				} catch (error) {
					return PrismaError(res, error);
				}

			case !!req.query.membershipId:
				try {
					await MembershipService.getMembershipById(
						req.query.membershipId as string,
					);

					const membershipProjects =
						await ProjectServices.getProjectsByMembershipId(
							req.query.membershipId as string,
						);
					return res.status(200).json({ projects: membershipProjects });
				} catch (error) {
					return PrismaError(res, error);
				}

			case !!Object.keys(req.body).length:
				const query = cleanObject(req.body);
				const { error } = validateProjectQuery(query);
				if (error) return res.status(400).json({ error: error.message });

				const projects = await ProjectServices.getProjectsByQuery(query);
				return res.status(200).json({ projects: projects });

			default:
				return res.status(400).json({ error: "Invalid query" });
		}
	};

	static updateProject = async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
			const { id } = req.params;
			const project: Project = req.body;

			const updatedProject = await ProjectServices.updateProject(id, project);
			return res.status(200).json({ project: updatedProject });
		} catch (error) {
			return PrismaError(res, error);
		}
	};
}
