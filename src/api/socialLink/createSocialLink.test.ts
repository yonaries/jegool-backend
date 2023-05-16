import request from "supertest";
import app from "../../app";
import { Page, PrismaClient, User } from ".prisma/client";

const prisma = new PrismaClient();

const ownerData = {
 firstName: "test",
 lastName: "test",
 displayName: "test",
 email: "test@gmail.com",
 residence: "ET",
};

const pageData = {
 name: "testPage",
 url: "https://test.com",
};

const socialLinkData = {
 url: "https://facebook.com",
 type: "FACEBOOK",
};

let owner: User;
let page: Page;

describe("Social Link API", () => {
 describe("POST /", () => {
  beforeAll(async () => {
   await prisma.user.deleteMany();
   await prisma.page.deleteMany();
   await prisma.socialLink.deleteMany();
   owner = await prisma.user.create({
    data: ownerData,
   });

   page = await prisma.page.create({
    data: {
     ...pageData,
     ownerId: owner.id,
    },
   });
  }, 200000);
  it("should create a social link", async () => {
   const response = await request(app)
    .post("/socialLink")
    .send({
     ...socialLinkData,
     pageId: page.id,
    });

   expect(response.status).toBe(201);
   expect(response.body.socialLink).toHaveProperty("id");
  });

  it("should return 400 if url is not valid", async () => {
   const response = await request(app)
    .post("/socialLink")
    .send({
     ...socialLinkData,
     url: "invalid url",
     pageId: page.id,
    });

   expect(response.status).toBe(400);
  });

  it("should return 400 if type is not valid", async () => {
   const response = await request(app)
    .post("/socialLink")
    .send({
     ...socialLinkData,
     type: "invalid type",
     pageId: page.id,
    });

   expect(response.status).toBe(400);
  });

  it("should return 404 if pageId is not valid", async () => {
   const response = await request(app)
    .post("/socialLink")
    .send({
     ...socialLinkData,
     pageId: "invalid page id",
    });

   expect(response.status).toBe(404);
  });

  it("should return 400 if pageId is not provided", async () => {
   const response = await request(app)
    .post("/socialLink")
    .send({
     ...socialLinkData,
    });

   expect(response.status).toBe(400);
  }, 20000);

  it("should return 400 if url is not provided", async () => {
   const response = await request(app)
    .post("/socialLink")
    .send({
     ...socialLinkData,
     pageId: page.id,
     url: "",
    });

   expect(response.status).toBe(400);
  });

  it("should return 400 if type is not provided", async () => {
   const response = await request(app)
    .post("/socialLink")
    .send({
     ...socialLinkData,
     pageId: page.id,
     type: "",
    });

   expect(response.status).toBe(400);
  });
 });
});
