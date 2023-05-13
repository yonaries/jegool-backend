import request from "supertest";
import { PrismaClient, User } from "@prisma/client";
import app from "../../app";

const prisma = new PrismaClient();

const user1Data = {
 firstName: "user1Name",
 lastName: "user1Name",
 displayName: "user1Name",
 email: "user1Name@gmail.com",
 residence: "ET",
};
const user2Data = {
 firstName: "user2Name",
 lastName: "user2Name",
 displayName: "user2Name",
 email: "user2Name@gmail.com",
 residence: "ET",
};
const user3Data = {
 firstName: "user3Name",
 lastName: "user3Name",
 displayName: "user3Name",
 email: "user3Name@gmail.com",
 residence: "ET",
};
const user4Data = {
 firstName: "user4Name",
 lastName: "user4Name",
 displayName: "user4Name",
 email: "user4Name@gmail.com",
 residence: "ET",
};

let user1: User;
let user2: User;
let user3: User;
let user4: User;

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
let chat1: any;
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
let chat2: any;
// rome-ignore lint/suspicious/noExplicitAny: <explanation>
let chat3: any;

describe("GET PrivateChat BY USER ID GET", () => {
 beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.chat.deleteMany();

  user1 = await prisma.user.create({ data: user1Data });
  user2 = await prisma.user.create({ data: user2Data });
  user3 = await prisma.user.create({ data: user3Data });
  user4 = await prisma.user.create({ data: user4Data });

  chat1 = await prisma.chat.create({
   data: {
    PrivateChat: {
     create: {
      user1Id: user1.id,
      user2Id: user2.id,
     },
    },
   },
  });
  chat2 = await prisma.chat.create({
   data: {
    PrivateChat: {
     create: {
      user1Id: user1.id,
      user2Id: user3.id,
     },
    },
   },
  });
 }, 200000);

 it("should return status 200 and private chats", async () => {
  const res = await request(app).get(`/user/${user1.id}/privateChats`);

  expect(res.status).toBe(200);
  expect(res.body.privateChats.length).toBe(2);
 });
 it("should return status 200 and private chats", async () => {
  const res = await request(app).get(`/user/${user2.id}/privateChats`);

  expect(res.status).toBe(200);
  expect(res.body.privateChats.length).toBe(1);
 });
 it("should return status 200 and private chats", async () => {
  const res = await request(app).get(`/user/${user4.id}/privateChats`);

  expect(res.status).toBe(200);
  expect(res.body.privateChats.length).toBe(0);
 });

 it("should return status 404 if user id is not found", async () => {
  const res = await request(app).get("/user/123/privateChats");
  expect(res.status).toBe(404);
 });
});
