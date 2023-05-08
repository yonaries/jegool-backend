import express from "express";
import SubscriptionController from "./subscription.controller";

const router = express.Router();

router.post("/", SubscriptionController.createSubscription);
router.get("/:id", SubscriptionController.getSubscriptionById);

export default router;
