import express from "express";
import BenefitController from "./benefit.controller";

const router = express.Router();

router.post("/", BenefitController.createBenefit);
router.get("/:id", BenefitController.getBenefitById);
router.get("/", BenefitController.getBenefitsByQuery);
router.put("/:id", BenefitController.updateBenefit);
router.delete("/:id", BenefitController.deleteBenefit);

export default router;
