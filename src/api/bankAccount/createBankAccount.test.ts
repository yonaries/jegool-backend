import request from "supertest";
import app from "../../app";
import { Page, PrismaClient, User } from "@prisma/client";

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

describe("Bank Account API", () => {
 describe("POST /bankAccount", () => {
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
  }, 200000);
  it("should create a new bank account", async () => {
   const res = await request(app)
    .post("/bankAccount")
    .send({ ...bankAccountData, pageId: page.id });
   expect(res.status).toBe(201);
  });

  it("should return 400 if bank account already exists", async () => {
   const res = await request(app)
    .post("/bankAccount")
    .send({ ...bankAccountData, pageId: page.id });
   expect(res.status).toBe(409);
  });

  it("should return 400 if field is missing", async () => {
   const res = await request(app)
    .post("/bankAccount")
    .send({ ...bankAccountData, pageId: "" });
   expect(res.status).toBe(400);
  });
 });
});
