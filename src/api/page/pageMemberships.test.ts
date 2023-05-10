import request from "supertest";
import app from "../../app";
import { Membership, Page, PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

const pageOwner = {
 firstName: "John",
 lastName: "Doe",
 displayName: "John Doe",
 email: "johndoe@gmail.com",
 residence: "ET",
};

const pageData = {
 name: "John Doe's Page",
 url: "https://jegool.com/johndoespage",
};

const membershipData = {
 title: "Gold",
 fee: 100,
 status: true,
 description: "Gold Membership",
};
const membershipData1 = {
 title: "Gold",
 fee: 200,
 status: true,
 description: "Gold Membership",
};
const membershipData2 = {
 title: "Gold",
 fee: 200,
 status: true,
 description: "Gold Membership",
};

let owner: User;
let page: Page;

describe("/page", () => {
 beforeAll(async () => {
  await prisma.subscription.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
 });

 beforeAll(async () => {
  owner = await prisma.user.create({
   data: pageOwner,
  });
  page = await prisma.page.create({
   data: {
    ...pageData,
    ownerId: owner.id,
   },
  });
  await prisma.membership.createMany({
   data: [
    {
     ...membershipData,
     pageId: page.id,
    },
    {
     ...membershipData1,
     pageId: page.id,
    },
    {
     ...membershipData2,
     pageId: page.id,
    },
   ],
  });
 });

 describe("GET /:id/memberships", () => {
  it("should return 200 and memberships", async () => {
   const res = await request(app).get(`/page/${page.id}/memberships`);
   expect(res.status).toBe(200);
  });

  it("should return 404 if page is not found", async () => {
   const res = await request(app).get("/page/123456789012345678901234/memberships");
   expect(res.status).toBe(404);
  });

  it("should return empty array if page has no memberships", async () => {
   owner = await prisma.user.create({
    data: {
     ...pageOwner,
     email: "testemail@gmail.com",
    },
   });
   page = await prisma.page.create({
    data: {
     ...pageData,
     ownerId: owner.id,
     url: "https://jegool.com/johndoespage1sdsd",
    },
   });
   const res = await request(app).get(`/page/${page.id}/memberships`);
   expect(res.status).toBe(200);
   expect(res.body.memberships).toEqual([]);
  });
 });
});
