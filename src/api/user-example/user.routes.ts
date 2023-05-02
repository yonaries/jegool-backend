import express from 'express';
import { getAllUsers } from './user.controllers';

const router = express.Router();

router.get('/', getAllUsers);

export default router;