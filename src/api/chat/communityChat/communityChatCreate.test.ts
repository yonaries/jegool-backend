import request from "supertest";
import { Page, PrismaClient, User } from "@prisma/client";
import app from "../../../app";

const prisma = new PrismaClient();

const ownerData = {
 firstName: "ownerName",
 lastName: "ownerName",
 displayName: "ownerName",
 email: "owner@gmail.com",
 residence: "ET",
};

const pageData = {
 name: "pageName",
 url: "www.page.com",
};

let owner: User;
let page: Page;

describe("CommunityChat POST", () => {
 beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.page.deleteMany();
  await prisma.chat.deleteMany();

  owner = await prisma.user.create({ data: ownerData });
  page = await prisma.page.create({ data: { ...pageData, ownerId: owner.id } });
 });

 it("should create a community chat", async () => {
  const res = await request(app).post("/communityChat").send({
   pageId: page.id,
  });

  expect(res.status).toBe(201);
  expect(res.body.communityChat).toHaveProperty("chatId");
  expect(res.body.communityChat).toHaveProperty("pageId");
 });

 it("should return status 400 if pageId is not provided", async () => {
  const res = await request(app).post("/communityChat").send({});
  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("error");
 });
});
