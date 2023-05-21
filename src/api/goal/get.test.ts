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

describe("Goal GET /goal/:id", () => {
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

 it("should get goal by id", async () => {
  const res = await request(app).get(`/goal/${goal.id}`);

  expect(res.status).toBe(200);
  expect(res.body.goal).toBeTruthy();
 });

 it("should return 404 if goal not found", async () => {
  const res = await request(app).get(`/goal/asyhbdasdkjkkxmdszh`);

  expect(res.status).toBe(404);
 });

 it("should return 404 if id is not provided", async () => {
  const res = await request(app).get(`/goal/`);
  expect(res.status).toBe(404);
 });

 afterAll(async () => {
  await prisma.goal.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
 });
});
