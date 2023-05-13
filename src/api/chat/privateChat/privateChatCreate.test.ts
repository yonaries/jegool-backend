import request from "supertest";
import { PrismaClient, User } from "@prisma/client";
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

describe("PrivateChat POST", () => {
 beforeAll(async () => {
  await prisma.user.deleteMany();
  await prisma.chat.deleteMany();

  user1 = await prisma.user.create({ data: user1Data });
  user2 = await prisma.user.create({ data: user2Data });
 });

 it("should create a private chat", async () => {
  const res = await request(app).post("/privateChat").send({
   user1Id: user1.id,
   user2Id: user2.id,
  });

  expect(res.status).toBe(201);
  expect(res.body.privateChat).toHaveProperty("chatId");
  expect(res.body.privateChat).toHaveProperty("user1Id");
  expect(res.body.privateChat).toHaveProperty("user2Id");
 });

 it("should return status 400 if user1Id is not provided", async () => {
  const res = await request(app).post("/privateChat").send({
   user2Id: user2.id,
  });

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("error");
 });

 it("should return status 400 if user2Id is not provided", async () => {
  const res = await request(app).post("/privateChat").send({
   user1Id: user1.id,
  });

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("error");
 });

 it("should return 400 if no data is passed", async () => {
  const res = await request(app).post("/privateChat").send({});

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty("error");
 });
});
