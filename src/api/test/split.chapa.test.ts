import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";
import ChapaController from "../chapa/chapa.controller";

const prisma = new PrismaClient();

describe("Split Chapa", async () => {
 const banks = await ChapaController.getBanks();

 const user = await prisma.user.create({
  data: {
   displayName: "John Doe",
   email: " johndoe@example.com",
   firstName: "John",
   lastName: "Doe",
   residence: "Addis Ababa",
   Page: {
    create: {
     name: "Hobbist",
     url: "http://google.com/",
     BankAccount: {
      create: {
       id: "faf",
       bankName: "Awash Bank",
       accountNo: "qewrqerqerqwerqwerqwer",
       accountName: "",
      },
     },
    },
   },
  },
  select: {
   id: true,
  },
 });

 it("should return a redirect url", async () => {
  const response = await request(app).post("/api/chapa/split/initialize").send({
   type: "split",
   id: "1",
   first_name: "John",
   last_name: "Doe",
   email: "johndoe@gmail.com",
   amount: 100,
   subaccount: "RS_1234567890",
   reference: "1234567890",
  });
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty("checkout_url");
 });
});
