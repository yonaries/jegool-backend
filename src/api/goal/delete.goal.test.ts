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

describe("Goal DELETE /goal/:id", () => {
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

 it("should delete goal by id", async () => {
  const res = await request(app).delete(`/goal/${goal.id}`);

  expect(res.status).toBe(200);
  expect(res.body.goal.id).toBe(goal.id);
 });

 it("should return 500 if goal not found", async () => {
  const res = await request(app).delete("/goal/notGoalId");
  expect(res.status).toBe(500);
 });
});
