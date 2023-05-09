import express from "express";
import SubscriptionController from "./subscription.controller";

const router = express.Router();

router.post("/", SubscriptionController.createSubscription);
router.get("/:id", SubscriptionController.getSubscriptionById);
router.delete("/:id", SubscriptionController.deleteSubscriptionById);
router.put("/:id", SubscriptionController.updateSubscriptionById);

export default router;
