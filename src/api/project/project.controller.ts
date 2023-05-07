import express from 'express';
import ProjectServices from './services';
import { Project } from '@prisma/client';
import { validateCreateProject } from './project.validate';
import PageServices from '../page/services';
import { handlePrismaError } from '../utils/prismaErrorHandler.util';


export default class ProjectController {
    static createProject = async (req: express.Request, res: express.Response) => {
        const project: Project = req.body;

        try {
            const page = await PageServices.getPageById(project.pageId)
            if (!page) return res.status(404).json({ error: 'Page not found' })

            const { error } = validateCreateProject(project);
            if (error) return res.status(400).json({ error: error.message });

            const createdProject = await ProjectServices.createProject(project);
            console.log("project.controller.ts: router.post: createdProject: ", createdProject);
            return res.status(201).json({ project: createdProject });

        } catch (error) {
            handlePrismaError(res, error, 'Project');
        }
    }
}