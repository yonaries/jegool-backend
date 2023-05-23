import express from "express";
import DonationItemController from "./donationItem.controller";

const router = express.Router();

router.post("/", DonationItemController.createDonationItem);
router.get("/:id", DonationItemController.getDonationItemById);
router.delete("/:id", DonationItemController.deleteDonationItemById);
router.get("/", DonationItemController.getDonationItems);
router.put("/:id", DonationItemController.updateDonationItemById);

export default router;
