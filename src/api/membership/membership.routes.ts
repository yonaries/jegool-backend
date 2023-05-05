import express from "express";
import MembershipController from "./membership.controller";

const router = express.Router();

router.post("/", MembershipController.createMembership);
router.get("/:id", MembershipController.getMembershipById);
router.put("/:id", MembershipController.updateMembershipById);

export default router;
