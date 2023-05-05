import express from "express";
import {
  createUserAccount,
  getAllUsers,
  getUserDataById,
  updateUserData,
  deleteUserData,
} from "./user.controller";

const router = express.Router();

router.post("/", createUserAccount);
router.get("/", getAllUsers);
router.get("/:id", getUserDataById);
router.put("/:id", updateUserData)
router.delete("/:id", deleteUserData)

export default router;
