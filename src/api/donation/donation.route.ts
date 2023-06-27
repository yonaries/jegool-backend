import { Router } from "express";
import DonationController from "./donation.controller";

const router = Router();
router.post("/", DonationController.createDonation);

export default router;
