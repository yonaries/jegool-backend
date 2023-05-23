import express from "express";
import DonationItemController from "./donationItem.controller";

const router = express.Router();

router.post("/", DonationItemController.createDonationItem);
router.get("/:id", DonationItemController.getDonationItemById);
router.delete("/:id", DonationItemController.deleteDonationItemById);

export default router;
