import express from "express";
import { createUserAccount } from "./user.controller";
import { validateCreateUser } from "./user.middleware";

const router = express.Router();

router.post('/', createUserAccount);

export default router;
