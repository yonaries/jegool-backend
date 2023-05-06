import request from "supertest";
import app from "../../app";
import { Transaction, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const correctData = {
  reference: "123456789",
  provider: "chapa",
  payer: "payer",
  payee: "payee",
  amount: 50,
  currency: "etb",
  remark: "remark",
  status: "PENDING",
};

const incorectDataInvalidStringOnStatus = {
  reference: "123456789",
  provider: "chapa",
  payer: "payer",
  payee: "payee",
  amount: 50,
  currency: "etb",
  remark: "remark",
  status: "INVALID_STATUS",
};

const incorrectDataMissingProperty = {
  reference: "123456789",
  provider: "chapa",
  payer: "payer",
  payee: "payee",
};

describe("/transaction", () => {
  describe("POST /", () => {
    test("should return 409 if transaction already exists", async () => {
      await request(app).post("/transaction").send(correctData);

      const res = await request(app).post("/transaction").send(correctData);
      expect(res.status).toBe(409);
      await prisma.transaction.deleteMany();
    }, 20000);
    test("should return 201 when transaction is created", async () => {
      const res = await request(app).post("/transaction").send(correctData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("reference");
    });

    test("should return 400 when transaction is created with invalid status", async () => {
      const res = await request(app)
        .post("/transaction")
        .send(incorectDataInvalidStringOnStatus);

      expect(res.status).toBe(400);
    });

    test("should return 400 when transaction is created with missing property", async () => {
      const res = await request(app)
        .post("/transaction")
        .send(incorrectDataMissingProperty);

      expect(res.status).toBe(400);
    });

    test("should return 400 when request body is empty", async () => {
      const res = await request(app).post("/transaction").send({});
      expect(res.status).toBe(400);
    });
  });

  describe("GET /:reference", () => {
    let reference: string = "";

    beforeAll(async () => {
      const testTransaction = await prisma.transaction.create({
        data: {
          reference: "12345678910",
          provider: "chapa",
          payer: "payer",
          amount: 50,
          currency: "etb",
          remark: "remark",
          status: "PENDING",
          payee: "payee",
        },
      });

      reference = testTransaction.reference;
    }, 20000);

    test("should return 200 when transaction is found", async () => {
      const res = await request(app).get(`/transaction/${reference}`);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("transaction");
    });

    test("should return 404 when transaction is not found", async () => {
      const res = await request(app).get(`/transaction/123456`);
      expect(res.status).toBe(404);
    });
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.$disconnect();
  }, 20000);
});
