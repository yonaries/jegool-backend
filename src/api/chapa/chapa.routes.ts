import { Router } from "express";
import ChapaController from "./chapa.controller";
import { Request, Response } from "express";
import { PayFor } from "./payment";
import { PrismaClient, Page } from "@prisma/client";
import { ChapaError } from "@/errors/chapa.error";

const router = Router();
const prisma = new PrismaClient();

router.get("/callback", ChapaController.callback);
router.get("/success", async (req: Request, res: Response) => {
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
});

export default router;
