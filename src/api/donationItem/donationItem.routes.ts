import express from "express";
import DonationItemController from "./donationItem.controller";

const router = express.Router();

router.post("/", DonationItemController.createDonationItem);

export default router;
