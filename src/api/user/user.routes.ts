import express from "express";
import {
 createUserAccount,
 getAllUsers,
 getUserDataById,
 updateUserData,
 deleteUserData,
 getUserSubscriptionsById,
 getUserPrivateChats,
} from "./user.controller";
import { verifyToken } from "@/middlewares/firebase.middlewares";

const router = express.Router();

router.post("/", verifyToken, createUserAccount);
router.get("/", verifyToken, getAllUsers);
router.get("/:id", verifyToken, getUserDataById);
router.put("/:id", verifyToken, updateUserData);
router.delete("/:id",verifyToken, deleteUserData);
router.get("/:id/subscriptions",verifyToken, getUserSubscriptionsById);
router.get("/:id/privateChats",verifyToken, getUserPrivateChats);

export default router;
