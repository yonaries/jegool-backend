import request from "supertest";
import { CommunityChat, Page, PrismaClient, User } from "@prisma/client";
import app from "../../../app";

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

let user1: User;
let user2: User;
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
let privateChat: any;

describe("PrivateChat GET /:id", () => {
 beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.chat.deleteMany();

  user1 = await prisma.user.create({ data: user1Data });
  user2 = await prisma.user.create({ data: user2Data });

  const chat = await prisma.chat.create({
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

  privateChat = chat.PrivateChat;
 }, 200000);

 it("should get a private chat by id", async () => {
  const res = await request(app).get(`/privateChat/${privateChat.chatId}`);

  expect(res.status).toBe(200);
  expect(res.body.privateChat).toHaveProperty("chatId");
  expect(res.body.privateChat).toHaveProperty("user1Id");
  expect(res.body.privateChat).toHaveProperty("user2Id");
 });

 it("should return status 404 if chatId invalid id is provided", async () => {
  const res = await request(app).get("/privateChat/invalidId");
  expect(res.status).toBe(404);
 });
});
