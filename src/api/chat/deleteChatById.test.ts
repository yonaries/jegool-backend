import request from "supertest";
import { CommunityChat, Page, PrismaClient, User } from "@prisma/client";
import app from "../../app";

const prisma = new PrismaClient();

const user1Data = {
 firstName: "user1Name",
 lastName: "user1Name",
 displayName: "user1Name",
 email: "user1@gmail.com",
 residence: "ET",
};
const user2Data = {
 firstName: "user2Name",
 lastName: "user2Name",
 displayName: "user2Name",
 email: "user2@gmail.com",
 residence: "ET",
};
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
let user1: User;
let user2: User;
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
let communityChat: any;
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
let privateChat: any;

describe("Chat DELETE /:id", () => {
 beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.chat.deleteMany();

  user1 = await prisma.user.create({ data: user1Data });
  user2 = await prisma.user.create({ data: user2Data });
  owner = await prisma.user.create({ data: ownerData });

  page = await prisma.page.create({ data: { ...pageData, ownerId: owner.id } });

  const pChat = await prisma.chat.create({
   data: {
    PrivateChat: {
     create: {
      user1Id: user1.id,
      user2Id: user2.id,
     },
    },
   },
   select: {
    PrivateChat: true,
   },
  });

  privateChat = pChat.PrivateChat;

  const cChat = await prisma.chat.create({
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

  communityChat = cChat.CommunityChat;
 }, 200000);

 describe("PrivateChat DELETE /:id", () => {
  it("should delete a private chat by id", async () => {
   const res = await request(app).delete(`/privateChat/${privateChat.chatId}`);

   expect(res.status).toBe(200);
  });

  it("should return status 404 if chatId invalid id is provided", async () => {
   const res = await request(app).delete("/privateChat/invalidId");

   expect(res.status).toBe(404);
  });
 });

 describe("CommunityChat DELETE /:id", () => {
  it("should delete a community chat by id", async () => {
   const res = await request(app).delete(`/communityChat/${communityChat.chatId}`);

   expect(res.status).toBe(200);
  });

  it("should return status 404 if chatId invalid id is provided", async () => {
   const res = await request(app).delete("/communityChat/invalidId");

   expect(res.status).toBe(404);
  });
 });
});
