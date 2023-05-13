import { PrismaError } from "@/errors/prisma.error";
import { PrismaClient, Subscription } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { Chapa, InitializeOptions } from "chapa-nodejs";
import dayjs from "dayjs";
import { Request, Response } from "express";
import SubscriptionServices from "../subscription/services";
import { PaymentType } from "./payment";

const prisma = new PrismaClient();
const chapa = new Chapa({
 secretKey: process.env.CHAPA_SECRET_KEY as string,
});
export default class ChapaController {
 //* ------------------ INITIALIZE ------------------
 // initialize is called by the frontend to initialize a transaction
 // it is called with a payload that has InitializeOptions type
 // it returns a redirect url to the frontend
 static async initialize(req: Request, res: Response) {
  const tx_ref = await chapa.generateTransactionReference();
  const { type, pageId, membershipId, userId, itemId, quantity, message } = req.body as {
   type: keyof typeof PaymentType;
   pageId: string;
   membershipId: string;
   userId: string;
   itemId: string;
   quantity: number;
   message: string;
  };

  // generate callback url based on the type of transaction
  const generateCallbackUrl = () => {
   if (type === "SUBSCRIPTION")
    return `${process.env.BASE_URL}/api/chapa/callback?&subscriberId=${userId}&membershipId=${membershipId}&type=${type}`;
   else if (type === "DONATION")
    return `${process.env.BASE_URL}/api/chapa/callback?&donorId=${userId}&pageId=${pageId}&itemId=${itemId}&quantity=${quantity}&message=${message}&type=${type}`;
  };

  const payload: InitializeOptions = {
   amount: req.body.amount,
   email: req.body.email,
   first_name: req.body.first_name,
   last_name: req.body.last_name,
   currency: "ETB",
   tx_ref,
   return_url: `${process.env.BASE_URL}/api/chapa/success/?type=${type}&tx_ref=${tx_ref}`,
   callback_url: generateCallbackUrl(),
  };

  try {
   const response = await chapa.initialize(payload);
   return res.redirect(response.data.checkout_url);
  } catch (error: any) {
   return res.status(500).json({
    error: {
     provider: "chapa",
     message: error.message,
     status: error.status,
    },
   });
  }
 }

 //* ------------------ CALLBACK ------------------
 // callback is called by chapa after a transaction is completed
 // it is called with a query string containing the type of transaction and the id of the transaction
 // it is also called with a body containing the tx_ref and status of the transaction
 // the tx_ref is used to verify the transaction
 // the status is used to determine if the transaction was successful or not

 // if the transaction was successful, the type of transaction is used to determine what to do
 // if the transaction was successful and the type of transaction is a subscription, the subscription status is updated to active or create a new subscription
 // if the transaction was successful and the type of transaction is a donation, create a new donation
 static async callback(req: Request, res: Response) {
  const { type, pageId, membershipId, userId, itemId, quantity, message } = req.query;
  const { tx_ref, status } = req.body as { tx_ref: string; status: string };

  // assign the query string to the body
  req.body.type = type;
  req.body.membershipId = membershipId;
  req.body.userId = userId;
  req.body.pageId = pageId;
  req.body.itemId = itemId;
  req.body.quantity = quantity;
  req.body.message = message;

  try {
   const response = await chapa.verify({ tx_ref });

   if (response.status === "success") {
    if (type === "SUBSCRIPTION") {
     const subscription = await SubscriptionServices.getSubscriptionByUserIdAndMembershipId(
      membershipId as string,
      userId as string,
     );

     // if subscription exists, update the subscription status to active and set the expiry date to 1 month from now
     // if subscription does not exist, create a new subscription
     if (subscription) {
      await SubscriptionServices.updateSubscriptionById(subscription.id, {
       status: "ACTIVE",
       expiryDate: dayjs().add(1, "month").toISOString(),
      });
     } else {
      await SubscriptionServices.createSubscription({
       membershipId: req.body.membershipId,
       subscriberId: req.body.userId,
       status: "ACTIVE",
      } as Subscription);
     }
    } else if (type === "DONATION") {
     //todo: create a new donation
    }
   }
  } catch (error: any) {
   console.error(error.message);
  }
 }

 //* ------------------ SUCCESS ------------------
 // success is called by the frontend after a transaction is completed
 // it is called with a query string containing the type of transaction and the id of the transaction
 // if the transaction was successful and the type of transaction is a subscription, redirect to the page url
 // if the transaction was successful and the type of transaction is a donation, redirect to the page url/donate/success
 static async success(req: Request, res: Response) {
  const { type, tx_ref } = req.query as { type: keyof typeof PaymentType; tx_ref: string; id: string };
  try {
   if (type === "SUBSCRIPTION") {
    // get the payee from the transaction table
    const payee = await prisma.transaction.findUniqueOrThrow({
     where: {
      reference: tx_ref,
     },
     select: {
      payee: true,
     },
    });

    // get the page url from the membership table
    const response = await prisma.membership.findUniqueOrThrow({
     where: {
      id: payee.payee,
     },
     select: {
      page: {
       select: {
        id: true,
        url: true,
       },
      },
     },
    });

    return res.redirect(`${response.page.url}`);
   } else if (type === "DONATION") {
    const response = await prisma.donation.findUniqueOrThrow({
     where: {
      id: tx_ref,
     },
     select: {
      page: {
       select: {
        id: true,
        url: true,
       },
      },
     },
    });
    return res.redirect(`${response.page.url}/donate/success`);
   }
  } catch (error) {
   if (error instanceof PrismaClientKnownRequestError) {
    PrismaError(res, error);
   } else {
    return res.status(500).json({ error });
   }
  }
 }
}
