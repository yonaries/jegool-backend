import express from "express";
import {
 createUserAccount,
 getAllUsers,
 getUserDataById,
 updateUserData,
 deleteUserData,
 getUserSubscriptionsById,
} from "./user.controller";

const router = express.Router();

router.post("/", createUserAccount);
router.get("/", getAllUsers);
router.get("/:id", getUserDataById);
router.put("/:id", updateUserData);
router.delete("/:id", deleteUserData);
router.get("/:id/subscriptions", getUserSubscriptionsById);

export default router;
