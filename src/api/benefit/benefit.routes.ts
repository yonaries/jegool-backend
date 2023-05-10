import express from "express";
import BenefitController from "./benefit.controller";

const router = express.Router();

router.post("/", BenefitController.createBenefit);
router.get("/:id", BenefitController.getBenefitById);
router.get("/", BenefitController.getBenefitsByQuery);

export default router;
