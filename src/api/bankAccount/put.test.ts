import request from "supertest";
import app from "../../app";
import { BankAccount, Page, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const ownerData = {
 firstName: "John",
 lastName: "Doe",
 displayName: "John Doe",
 email: "john@gmail.com",
 residence: "ETH",
};

const pageData = {
 name: "John Doe",
 url: "https://www.johndoe.com",
};

const bankAccountData = {
 id: "123",
 bankCode: "123",
 bankName: "Bank of America",
 accountNo: "1234567890",
};

let owner: User;
let page: Page;
let bankAccount: BankAccount;

describe("Bank Account API", () => {
 describe("PUT /bankAccount/:id", () => {
  beforeAll(async () => {
   await prisma.bankAccount.deleteMany();
   await prisma.page.deleteMany();
   await prisma.user.deleteMany();

   owner = await prisma.user.create({
    data: ownerData,
   });

   page = await prisma.page.create({
    data: {
     ...pageData,
     ownerId: owner.id,
    },
   });

   bankAccount = await prisma.bankAccount.create({
    data: {
     ...bankAccountData,
     pageId: page.id,
    },
   });
  }, 200000);

  it("should update bank account", async () => {
   const res = await request(app).put(`/bankAccount/${bankAccount.id}`).send(bankAccountData);
   expect(res.status).toBe(200);
  });

  it("should return 404 if bank account id is not provided", async () => {
   const res = await request(app)
    .put(`/bankAccount/`)
    .send({
     ...bankAccountData,
     accountNo: "0987654321",
    });
   expect(res.status).toBe(404);
  });

  it("should return 404 if bank account id is invalid", async () => {
   const res = await request(app)
    .put(`/bankAccount/123sdsd`)
    .send({
     ...bankAccountData,
     accountNo: "0987654321",
    });
   expect(res.status).toBe(404);
  });

  it("should return 400 if bank account data is invalid", async () => {
   const res = await request(app)
    .put(`/bankAccount/${bankAccount.id}`)
    .send({
     ...bankAccountData,
     accountNo: "0987654321",
     bankCode: "",
    });
   expect(res.status).toBe(400);
  });

  it("should return 400 if bank account data is invalid", async () => {
   const res = await request(app).put(`/bankAccount/${bankAccount.id}`).send({});
   expect(res.status).toBe(400);
  });
 });
});
