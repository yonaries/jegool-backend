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
    beforeAll(async () => {
      await prisma.transaction.deleteMany();
    }, 20000);

    test("should return 409 if transaction already exists", async () => {
      const testTransaction = await request(app)
        .post("/transaction")
        .send(correctData);

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
});
