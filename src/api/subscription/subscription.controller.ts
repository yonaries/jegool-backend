import { Request, Response } from "express";
import { handlePrismaError } from "../utils/prismaErrorHandler.util";
import SubscriptionServices from "./services";
import { validateSubscription } from "./subscription.validate";
import UserService from "../user/services";
import MembershipService from "../membership/services";
import PageServices from "../page/services";
import TransactionServices from "../transaction/services";
import { TransactionWithOnlyNeededFields } from "../transaction/transaction.type";

export default class SubscriptionController {
  static async createSubscription(req: Request, res: Response) {
    let subscription = req.body;

    try {
      const { error } = validateSubscription(subscription);
      if (error) return res.status(400).json({ error: error.message });

      const subscriber = await UserService.getUserById(subscription.subscriberId);
      if (!subscriber)
        return res.status(404).json({ error: "Subscriber user not found" });

      const membership = await MembershipService.getMembershipById(
        subscription.membershipId
      );
      if (!membership)
        return res.status(404).json({ error: "Membership not found" });

      // check if user already subscribed to this membership
      const existingSubscription =
        await SubscriptionServices.getSubscriptionByUserIdAndMembershipId(
          membership.id,
          subscriber.id
        );
      if (existingSubscription)
        return res
          .status(400)
          .json({ error: "User already subscribed to this membership" });

      // get payee info
      const page = await PageServices.getPageById(membership.pageId);
      if (!page)
        return res.status(404).json({
          error: "The Page that this membership belongs to is not found",
        });
      const payee = await UserService.getUserById(page.ownerId);

      // create transaction
      const transactionData: TransactionWithOnlyNeededFields = {
        amount: membership.fee,
        currency: "ETB",
        payee: payee?.firstName + " " + payee?.lastName,
        payer: subscriber.firstName + " " + subscriber.lastName,
        remark: "Subscription fee for " + membership.title,
        provider: "chapa",
        status: "PENDING",
      };
      const transaction = await TransactionServices.createTransaction({
        ...transactionData,
      });

      if (!transaction)
        return res.status(500).json({ error: "Failed to create transaction" });

      const newSubscription = await SubscriptionServices.createSubscription({
        ...subscription,
        transactionId: transaction.reference,
        status: "PENDING",
      });
      res.status(201).json({ subscription: newSubscription });
    } catch (error) {
      handlePrismaError(res, error, "Subscription");
    }
  }
}
