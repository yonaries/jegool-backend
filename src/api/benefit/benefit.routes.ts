import express from "express";
import BenefitController from "./benefit.controller";

const router = express.Router();

router.post("/", BenefitController.createBenefit);

export default router;
