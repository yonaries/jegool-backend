import { Donation, PrismaClient, Transaction } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import axios from "axios";
import { Chapa, CreateSubaccountOptions, InitializeOptions } from "chapa-nodejs";
import dayjs from "dayjs";
import { Request, Response } from "express";
import { PrismaError } from "../../errors/prisma.error";
import parseQueryFromUrl from "../../utils/parse_query_string";
import SubscriptionServices from "../subscription/services";
import TransactionServices from "../transaction/services";
import { PaymentType } from "./payment";
import ChapaError from "../../errors/chapa.error";
import DonationService from "../donation/services";
import dot from "dotenv";

dot.config();

const prisma = new PrismaClient();
const chapa = new Chapa({
 secretKey: process.env.CHAPA_SECRET_KEY as string,
});

const CHAPA_URL = "https://api.chapa.co/v1/transaction/initialize";

// req header with chapa secret key
const config = {
 headers: {
  Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
  "Content-Type": "application/json",
 },
};
export default class ChapaController {
 //* ------------------ INITIALIZE ------------------
 // initialize is called by the frontend to initialize a transaction
 // it is called with a payload that has InitializeOptions type
 // it returns a redirect url to the frontend
 static async initialize({
  type,
  id,
  first_name,
  last_name,
  email,
  amount,
  subaccount,
  reference,
 }: {
  type: keyof typeof PaymentType;
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  amount: number;
  subaccount: string;
  reference: string;
 }): Promise<string> {
  try {
   const payload = {
    amount: amount.toString(),
    currency: "ETB",
    tx_ref: reference,
    subaccounts: [{ id: subaccount }],
    return_url: `${process.env.BASE_URL}/chapa/success/?type=${type}&tx_ref=${reference}`,
    callback_url: `${process.env.BASE_URL}/chapa/callback?type=${type}&id=${id}`,
   };

   console.log("payload =>", payload);

   //  const response = await chapa.initialize(payload);
   const response = await axios.post(CHAPA_URL, payload, config);
   console.log("response =>", response.data);
   return response.data.data.checkout_url;
  } catch (error: any) {
   throw new ChapaError(error.message, error.status);
  }
 }

 static async createSubaccount(data: CreateSubaccountOptions) {
  try {
   const response = await chapa.createSubaccount(data);
   const { subaccount_id } = response.data as any;
   return subaccount_id;
  } catch (error: any) {
   throw new ChapaError(error.message, error.status);
  }
 }

 static async getBanks() {
  try {
   const response = await chapa.getBanks();
   return response.data;
  } catch (error: any) {
   throw new ChapaError(error.message, error.status);
  }
 }

 //* ------------------ CALLBACK ------------------
 // callback is called by chapa after a transaction is completed
 // it is called with a query string containing the type of transaction and the id of the transaction
 // it is also called with a body containing the tx_ref and status of the transaction
 // the tx_ref is used to verify the transaction
 // the status is used to determine if the transaction was successful or not

 // if the transaction was successful, the type of transaction is used to determine what to do
 // if the transaction was successful and the type of transaction is a subscription, the subscription status is updated to active and the expiry date is set to 1 month from now
 // if the transaction was successful and the type of transaction is a donation, update the donation status to successful or failed
 static async callback(req: Request, res: Response) {
  const { type, id } = req.query;
  const { trx_ref, status } = req.body;
  console.log("callback query:", {
   type,
   id,
   trx_ref,
   status,
  });

  try {
   const response = await chapa.verify({ tx_ref: trx_ref });

   if (response.status === "success") {
    await TransactionServices.updateTransactionByReference(trx_ref, {
     status: "SUCCESS",
    } as Transaction);

    if (type === "SUBSCRIPTION") {
     // update the subscription status to active and set the expiry date to 1 month from now
     await SubscriptionServices.updateSubscriptionById(id as string, {
      status: "ACTIVE",
      expiryDate: dayjs().add(1, "month").toISOString(),
     });
     console.log("subscription updated");
    } else if (type === "DONATION") {
     //todo: update the donation status to successful or failed
     await DonationService.updateDonation(
      id as string,
      {
       status: "SUCCESS",
      } as Donation,
     );
    }
   }
  } catch (error: any) {
   console.error(error.message);
   await TransactionServices.updateTransactionByReference(trx_ref, {
    status: "FAILED",
   } as Transaction);
  }
 }

 //* ------------------ SUCCESS ------------------
 // success is called by the frontend after a transaction is completed
 // it is called with a query string containing the type of transaction and the id of the transaction
 // if the transaction was successful and the type of transaction is a subscription, redirect to the page url
 // if the transaction was successful and the type of transaction is a donation, redirect to the page url/donate/success
 static async success(req: Request, res: Response) {
  const query = parseQueryFromUrl(req.url);
  const { type, tx_ref } = query as { type: keyof typeof PaymentType; tx_ref: string };

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
    const response = await prisma.subscription.findUniqueOrThrow({
     where: {
      id: payee.payee,
     },
     select: {
      membership: {
       select: {
        page: {
         select: {
          id: true,
          url: true,
         },
        },
       },
      },
     },
    });

    return res.redirect(`https://jegool.vercel.app/${response.membership.page.url}`);
   } else if (type === "DONATION") {
    const response = await prisma.donation.findFirstOrThrow({
     where: {
      transactionId: tx_ref,
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
    return res.redirect(`https://jegool.vercel.app/success`);
   }
  } catch (error) {
   if (error instanceof PrismaClientKnownRequestError) {
    return PrismaError(res, error);
   } else {
    return res.status(500).json({ error });
   }
  }
 }
}
