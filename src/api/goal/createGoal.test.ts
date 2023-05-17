import request from "supertest";
import app from "../../app";
import { Goal, Page, Prisma, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const ownerData = {
 firstName: "Test Owner",
 lastName: "Test Owner",
 displayName: "Test Owner",
 residence: "ET",
 email: "owner@gmail.com",
};

const pageData = {
 name: "Test Page",
 url: "www.testpage.com",
};

const goalData = {
 title: "Test Goal",
 description: "Test Goal Description",
 type: "COMMUNITY",
 amount: 1000,
};

let page: Page;
let owner: User;
let goal: Goal;

describe("Goal API", () => {
 describe("POST /goal", () => {
  beforeAll(async () => {
   await prisma.user.deleteMany();
   await prisma.page.deleteMany();
   await prisma.goal.deleteMany();
   //    await prisma.user.delete({ where: { id: owner.id, email: owner.email } });
   //    await prisma.page.delete({ where: { id: page.id, ownerId: owner.id, url: pageData.url } });
   //    await prisma.goal.delete({ where: { id: goal.id } });
  }, 20000);
  beforeAll(async () => {
   owner = await prisma.user.create({ data: ownerData });
   page = await prisma.page.create({ data: { ...pageData, ownerId: owner.id } });
  }, 20000);

  it("should create a new goal", async () => {
   const res = await request(app)
    .post("/goal")
    .send({ ...goalData, pageId: page.id });
   goal = res.body.goal;
   console.log("CREATED GOAL =====================", res.body.goal);
   expect(res.status).toBe(201);
  });

  it("should return 400 if goal type is invalid", async () => {
   const res = await request(app)
    .post("/goal")
    .send({ ...goalData, pageId: page.id, type: "INVALID" });
   expect(res.status).toBe(400);
  });

  it("should return 400 if goal amount is invalid", async () => {
   const res = await request(app)
    .post("/goal")
    .send({ ...goalData, pageId: page.id, amount: "sadsda" });
   expect(res.status).toBe(400);
  });

  it("should return 500 if goal pageId is invalid", async () => {
   const res = await request(app)
    .post("/goal")
    .send({ ...goalData, pageId: "INVALID" });
   expect(res.status).toBe(500);
  });

  it("should return 400 if goal title is invalid", async () => {
   const res = await request(app)
    .post("/goal")
    .send({ ...goalData, pageId: page.id, title: "" });
   expect(res.status).toBe(400);
  });

  it("should return 400 if goal description is invalid", async () => {
   const res = await request(app)
    .post("/goal")
    .send({ ...goalData, pageId: page.id, description: "" });
   expect(res.status).toBe(400);
  });
 });
});
