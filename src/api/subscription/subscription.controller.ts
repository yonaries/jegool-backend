import { Request, Response } from "express";
import { handlePrismaError } from "../utils/prismaErrorHandler.util";
import SubscriptionServices from "./services";
import { validateSubscription } from "./subscription.validate";

export default class SubscriptionController {
  static async createSubscription(req: Request, res: Response) {
    const subscription = req.body;

    try {
      const { error } = validateSubscription(subscription);
      if (error) return res.status(400).json({ error: error.message });
      const newSubscription = await SubscriptionServices.createSubscription(
        subscription
      );
      res.status(201).json(newSubscription);
    } catch (error) {
      handlePrismaError(res, error, "Subscription");
    }
  }
}
