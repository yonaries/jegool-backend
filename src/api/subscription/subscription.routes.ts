import express from "express";
import SubscriptionController from "./subscription.controller";

const router = express.Router();

router.post("/", SubscriptionController.createSubscription);
router.get("/:id", SubscriptionController.getSubscriptionById);
router.delete("/:id", SubscriptionController.deleteSubscriptionById);

export default router;
