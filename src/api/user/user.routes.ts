import express from "express";
import {
  createUserAccount,
  getAllUsers,
  getUserDataById,
  updateUserData,
} from "./user.controller";
import { validateCreateUser } from "./user.middleware";

const router = express.Router();

router.post("/", createUserAccount);
router.get("/", getAllUsers);
router.get("/:id", getUserDataById);
router.put("/:id", updateUserData)

export default router;
