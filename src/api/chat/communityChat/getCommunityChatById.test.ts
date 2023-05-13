import request from "supertest";
import { CommunityChat, Page, PrismaClient, User } from "@prisma/client";
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
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
let communityChat: any;

describe("CommunityChat GET /:id", () => {
 beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.page.deleteMany();
  await prisma.chat.deleteMany();

  owner = await prisma.user.create({ data: ownerData });
  page = await prisma.page.create({ data: { ...pageData, ownerId: owner.id } });
  const chat = await prisma.chat.create({
   data: {
    CommunityChat: {
     create: {
      pageId: page.id,
     },
    },
   },
   select: {
    CommunityChat: true,
   },
  });

  communityChat = chat.CommunityChat;
 });

 it("should get a community chat by id", async () => {
  const res = await request(app).get(`/communityChat/${communityChat.chatId}`);

  expect(res.status).toBe(200);
  expect(res.body.communityChat).toHaveProperty("chatId");
  expect(res.body.communityChat).toHaveProperty("pageId");
 });

 it("should return status 404 if chatId invalid id is provided", async () => {
  const res = await request(app).get("/communityChat/invalidId");

  expect(res.status).toBe(404);
  expect(res.body).toHaveProperty("error");
 });
});
