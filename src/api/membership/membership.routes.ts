import express from "express";
import MembershipController from "./membership.controller";

const router = express.Router();

router.post("/", MembershipController.createMembership);

export default router;
