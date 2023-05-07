import express from 'express';
import ProjectController from './project.controller';

const router = express.Router();

router.post('/', ProjectController.createProject);

export default router;