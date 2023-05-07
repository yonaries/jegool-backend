import express from "express";
import ProjectServices from "./services";
import { Project } from "@prisma/client";
import { validateCreateProject } from "./project.validate";
import PageServices from "../page/services";
import { handlePrismaError } from "../utils/prismaErrorHandler.util";
import MembershipService from "../membership/services";

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
			const project = await ProjectServices.getProjectById(id);
			return res.status(200).json({ project: { ...project } });
		} catch (error) {
			return handlePrismaError(res, error, "Project");
		}
	};

	static getProjectsByPageId = async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
			const { pageId } = req.query;
			console.log("page id:", pageId);

			await PageServices.getPageById(pageId as string);
			const projects = await ProjectServices.getProjectsByPageId(
				pageId as string,
			);
			return res.status(200).json({ projects: [...projects] });
		} catch (error) {
			return handlePrismaError(res, error, "Project");
		}
	};

	static getProjectsByMembershipId = async (
		req: express.Request,
		res: express.Response,
	) => {
		try {
			const { membershipId } = req.query;
			console.log("membership id:", membershipId);

			await MembershipService.getMembershipById(membershipId as string);
			const project = await ProjectServices.getProjectsByMembershipId(
				membershipId as string,
			);

			return res.status(200).json({ project: [...project] });
		} catch (error) {
			return handlePrismaError(res, error, "Project");
		}
	};
}
