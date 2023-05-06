import request from "supertest";
import app from "../../app";
import { Subscription, PrismaClient } from "@prisma/client";
import { subscribe } from "diagnostics_channel";

const prisma = new PrismaClient();

describe("subscription", () => {
  describe("POST /subscription", () => {
    let subscriberId = "";
    let membershipId = "";
    let transactionId = "";
    beforeAll(async () => {
      const subscriber = await prisma.user.create({
        data: {
          firstName: "John",
          lastName: "Doe",
          displayName: "John Doe",
          email: "johndoe@gmail.com",
          residence: "Lagos",
        },
      });
      subscriberId = subscriber.id;
      const pageOwner = await prisma.user.create({
        data: {
          firstName: "pageOwner",
          lastName: "pageOwner",
          displayName: "pageOwner",
          email: "pageOwner@gmail.com",
          residence: "Lagos",
        },
      });

      const page = await prisma.page.create({
        data: {
          ownerId: pageOwner.id,
          name: "testing subscription",
          url: "https://www.testing.com",
        },
      });

      const membership = await prisma.membership.create({
        data: {
          title: "test membership",
          fee: 1000,
          status: true,
          pageId: page.id,
        },
      });
      membershipId = membership.id;

      const transaction = await prisma.transaction.create({
        data: {
          reference: "testingsubscription",
          provider: "paystack",
          payer: subscriberId,
          payee: pageOwner.id,
          amount: 1000,
          currency: "NGN",
          remark: "test transaction",
          status: "SUCCESS",
        },
      });
      transactionId = transaction.reference;
    }, 200000);

    test("should create a subscription and return 201 status", async () => {
      const res = await request(app).post("/subscription").send({
        status: "SUCCESS",
        subscriberId,
        membershipId,
        transactionId,
      });

      expect(res.status).toBe(201);
    });

    test("should return 400 status if subscriberId is not provided", async () => {
      const res = await request(app).post("/subscription").send({
        status: "SUCCESS",
        membershipId,
        transactionId,
      });

      expect(res.status).toBe(400);
    });

    test("should return 400 status if membershipId is not provided", async () => {
      const res = await request(app).post("/subscription").send({
        status: "SUCCESS",
        subscriberId,
        transactionId,
      });

      expect(res.status).toBe(400);
    });

    test("should return 400 status if transactionId is not provided", async () => {
      const res = await request(app).post("/subscription").send({
        status: "SUCCESS",
        subscriberId,
        membershipId,
      });

      expect(res.status).toBe(400);
    });

    test("should return 400 status if status is not provided", async () => {
      const res = await request(app).post("/subscription").send({
        subscriberId,
        membershipId,
        transactionId,
      });

      expect(res.status).toBe(400);
    });

    test("should return 400 status if status is not valid", async () => {
      const res = await request(app).post("/subscription").send({
        status: "NOT_VALID",
        subscriberId,
        membershipId,
        transactionId,
      });

      expect(res.status).toBe(400);
    });
	

    afterAll(async () => {
      await prisma.subscription.deleteMany();
      await prisma.membership.deleteMany();
      await prisma.page.deleteMany();
      await prisma.user.deleteMany();
      await prisma.transaction.deleteMany();
    }, 200000);
  });
});
