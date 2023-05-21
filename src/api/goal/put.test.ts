import request from "supertest";
import app from "../../app";
import { Goal, Page, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const ownerData = {
 firstName: "John",
 lastName: "Doe",
 email: "john@gmail.com",
 displayName: "John Doe",
 residence: "ET",
};

const pageData = {
 name: "My Page",
 url: "my-page.com",
};

const goalData = {
 title: "My Goal",
 type: "COMMUNITY",
 amount: 1000,
 description: "My Goal Description",
};

let owner: User;
let page: Page;
let goal: Goal;

describe("Goal PUT /goal/:id", () => {
 beforeAll(async () => {
  await prisma.goal.deleteMany();
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

  goal = await prisma.goal.create({
   data: {
    ...goalData,
    type: "COMMUNITY",
    pageId: page.id,
   },
  });
 }, 200000);

 it("should update goal by id", async () => {
  const res = await request(app).put(`/goal/${goal.id}`).send({
   title: "My Goal Updated",
  });

  expect(res.status).toBe(200);
  expect(res.body.goal.title).toBe("My Goal Updated");
 });

 it("should return 500 if goal id is not found", async () => {
  const res = await request(app).put(`/goal/1234567890`).send({
   title: "My Goal Updated",
  });

  expect(res.status).toBe(500);
 });

 it("should return 400 if goal data is not valid", async () => {
  const res = await request(app).put(`/goal/${goal.id}`).send({
   title: "",
  });

  expect(res.status).toBe(400);
 });

 it("should return 400 if goal data is not provided", async () => {
  const res = await request(app).put(`/goal/${goal.id}`);
  expect(res.status).toBe(400);
 });

 it("should return 400 if goal  type is not valid", async () => {
  const res = await request(app).put(`/goal/${goal.id}`).send({
   type: "INVALID",
  });

  expect(res.status).toBe(400);
 });

 it("should return 400 if goal amount is not valid", async () => {
  const res = await request(app).put(`/goal/${goal.id}`).send({
   amount: "INVALID",
  });

  expect(res.status).toBe(400);
 });

 afterAll(async () => {
  await prisma.goal.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
 });
});
