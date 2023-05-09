import { Request, Response } from "express";
import { PrismaError } from "../../errors/prisma.error";
import SubscriptionServices from "./services";
import {
  validateSubscription,
  validateSubscriptionOnUpdate,
} from "./subscription.validate";
import UserService from "../user/services";
import MembershipService from "../membership/services";
import PageServices from "../page/services";
import TransactionServices from "../transaction/services";
import { TransactionWithOnlyNeededFields } from "../transaction/transaction.type";
import dayjs from "dayjs";

export default class SubscriptionController {
  static async createSubscription(req: Request, res: Response) {
    const subscription = req.body;

    try {
      const { error } = validateSubscription(subscription);
      if (error) return res.status(400).json({ error: error.message });

      const subscriber = await UserService.getUserById(
        subscription.subscriberId
      );
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

      // create transaction
      const transactionData: TransactionWithOnlyNeededFields = {
        amount: membership.fee,
        currency: "ETB",
        payee: page.id,
        payer: subscriber.id,
        remark: `Subscription fee for ${membership.title}`,
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
        status: "INACTIVE",
        expiryDate: dayjs().toISOString(),
      });
      res.status(201).json({ subscription: newSubscription });
    } catch (error) {
      PrismaError(res, error);
    }
  }

  static async getSubscriptionById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const subscription = await SubscriptionServices.getSubscriptionById(id);
      if (!subscription)
        return res.status(404).json({ error: "Subscription not found" });
      return res.status(200).json({ subscription });
    } catch (error) {
      PrismaError(res, error);
    }
  }

  static async deleteSubscriptionById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedSubscription =
        await SubscriptionServices.deleteSubscriptionById(id);
      if (!deletedSubscription)
        return res.status(404).json({ error: "Subscription not found" });
      return res.status(204).json({ subscription: deletedSubscription });
    } catch (error) {
      PrismaError(res, error);
    }
  }

  static async updateSubscriptionById(req: Request, res: Response) {
    const { id } = req.params;
    const subscriptionData = req.body;

    try {
      const { error, value } = validateSubscriptionOnUpdate(subscriptionData);
      if (error) return res.status(400).json({ error: error.message });

      // validating the date
      const expiryDate = dayjs(subscriptionData.expiryDate, "YYYY-MM-DD");
      if (!expiryDate.isValid())
        return res
          .status(400)
          .json({
            error:
              "Invalid expiry date it should be in YYYY-MM-DD HH:mm:ss format",
          });
      expiryDate.format("YYYY-MM-DD HH:mm:ss");
      subscriptionData.expiryDate = expiryDate.toISOString();

      const updatedSubscription =
        await SubscriptionServices.updateSubscriptionById(id, subscriptionData);
      if (!updatedSubscription)
        return res.status(404).json({ error: "Subscription not found" });
      return res.status(200).json({ subscription: updatedSubscription });
    } catch (error) {
      PrismaError(res, error);
    }
  }
}
