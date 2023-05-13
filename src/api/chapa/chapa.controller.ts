import { Chapa, InitializeOptions, InitializeResponse, VerifyResponse } from "chapa-nodejs";
import { PayFor } from "./payment";
import { ChapaError } from "@/errors/chapa.error";
import { Request, Response } from "express";
import SubscriptionServices from "../subscription/services";
import dayjs from "dayjs";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { PrismaError } from "@/errors/prisma.error";

const prisma = new PrismaClient();
export default class ChapaController {
 static chapa: Chapa;

 constructor() {
  ChapaController.chapa = new Chapa({
   secretKey: process.env.CHAPA_SECRET_KEY as string,
  });
 }

 static async initialize(
  type: keyof typeof PayFor,
  id: string,
  payload: InitializeOptions,
 ): Promise<InitializeResponse> {
  try {
   const tx_ref = `TX${type}_${id}-${Date.now()}`;
   const response = await ChapaController.chapa.initialize({
    ...payload,
    tx_ref,
    callback_url: `${process.env.BASE_URL}/api/chapa/callback/?type=${type}&id=${id}`,
    return_url: `${process.env.BASE_URL}/api/chapa/success/?type=${type}&id=${id}`,
   });
   return response;
   // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
   throw new ChapaError(error.message, error.status);
  }
 }

 static async verify(tx_ref: string): Promise<VerifyResponse> {
  try {
   const response = await ChapaController.chapa.verify({
    tx_ref,
   });
   return response;
   // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  } catch (error: any) {
   throw new ChapaError(error.message, error.status);
  }
 }

 static async callback(req: Request, res: Response) {
  const { type, id } = req.query as { type: keyof typeof PayFor; id: string };
  const { tx_ref } = req.body as { tx_ref: string };

  try {
   const response = await ChapaController.verify(tx_ref);
   if (response.status === "success") {
    if (type === "SUBSCRIPTION") {
     await SubscriptionServices.updateSubscriptionById(id, {
      status: "ACTIVE",
      expiryDate: dayjs().add(30, "day").toISOString(),
     });
    } else if (type === "DONATION") {
     //todo: update donation status
    }
   }
  } catch (error) {
   if (error instanceof ChapaError) {
    console.log(error);
   }
   if (type === "DONATION") {
    //todo: delete donation
   }
  }
 }

 static async success(req: Request, res: Response) {
  const { type, id } = req.query as { type: keyof typeof PayFor; id: string };
  try {
   if (type === "SUBSCRIPTION") {
    const response = await prisma.subscription.findUnique({
     where: {
      id,
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

    return res.redirect(`${response?.membership.page.url}`);
   } else if (type === "DONATION") {
    const response = await prisma.donation.findUnique({
     where: {
      id,
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
    return res.redirect(`${response?.page.url}`);
   }
  } catch (error) {
   if (error instanceof ChapaError) {
    console.log(error);
   }
   if (type === "DONATION") {
   }
  }
 }
}
