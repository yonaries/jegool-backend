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

let owner: User;
let page: Page;

describe("SocialLink GET /page/:id/socialLinks", () => {
 beforeAll(async () => {
  await prisma.socialLink.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();

  owner = await prisma.user.create({
   data: ownerData,
  });

  page = await prisma.page.create({
   data: {
    ...pageData,
    ownerId: owner.id,
    SocialLink: {
     create: [
      {
       url: "https://facebook.com",
       type: "FACEBOOK",
      },

      {
       url: "https://instagram.com",
       type: "INSTAGRAM",
      },
      {
       url: "https://twitter.com",
       type: "TWITTER",
      },
     ],
    },
   },
  });
 }, 200000);

 it("should get social links by page id", async () => {
  const res = await request(app).get(`/page/${page.id}/socialLinks`);

  expect(res.status).toBe(200);
  expect(res.body.socialLinks.length).toBe(3);
 });

 it("should return 404 if page not found", async () => {
  const res = await request(app).get(`/page/123/socialLinks`);

  expect(res.status).toBe(404);
 });

 it("should return 200 and empty array if page has no social links", async () => {
  await prisma.socialLink.deleteMany();

  const res = await request(app).get(`/page/${page.id}/socialLinks`);

  expect(res.status).toBe(200);
  expect(res.body.socialLinks.length).toBe(0);
 });

 it("should return 404 if page id is invalid", async () => {
  const res = await request(app).get(`/page/123/socialLinks`);

  expect(res.status).toBe(404);
 });

 afterAll(async () => {
  await prisma.socialLink.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
 });
});
