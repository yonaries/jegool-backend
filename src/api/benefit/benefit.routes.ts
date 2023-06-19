import express from "express";
import BenefitController from "./benefit.controller";
import { verifyToken } from "@/middlewares/firebase.middlewares";

const router = express.Router();

router.post("/", verifyToken, BenefitController.createBenefit);
router.get("/:id", verifyToken, BenefitController.getBenefitById);
router.get("/", verifyToken, BenefitController.getBenefitsByQuery);
router.put("/:id", verifyToken, BenefitController.updateBenefit);
router.delete("/:id", verifyToken, BenefitController.deleteBenefit);

export default router;
