import request from "supertest";
import app from "../../app";
import { Page, PrismaClient, SocialLink, SocialLinkType, User } from ".prisma/client";

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
 pageId: "",
};

let owner: User;
let page: Page;
let socialLink: SocialLink;

describe("Social Link API", () => {
 describe("PUT /:id", () => {
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

   socialLink = await prisma.socialLink.create({
    data: {
     url: socialLinkData.url,
     type: socialLinkData.type as SocialLinkType,
     pageId: page.id,
    },
   });
  }, 200000);

  it("should update a social link", async () => {
   const response = await request(app).put(`/socialLink/${socialLink.id}`).send({
    url: "https://twitter.com",
    type: "TWITTER",
   });

   expect(response.status).toBe(200);
   expect(response.body.socialLink).toHaveProperty("id");
   expect(response.body.socialLink.url).toBe("https://twitter.com");
   expect(response.body.socialLink.type).toBe("TWITTER");
  });

  it("should return 400 if url is not valid", async () => {
   const response = await request(app).put(`/socialLink/${socialLink.id}`).send({
    url: "invalidUrl",
    type: "FACEBOOK",
   });

   expect(response.status).toBe(400);
  });

  it("should return 400 if type is not valid", async () => {
   const response = await request(app).put(`/socialLink/${socialLink.id}`).send({
    url: "https://twitter.com",
    type: "invalidType",
   });

   expect(response.status).toBe(400);
  });

  it("should return 404 if social link is not found", async () => {
   const response = await request(app).put(`/socialLink/invalidId`).send({
    url: "https://twitter.com",
    type: "TWITTER",
   });

   expect(response.status).toBe(404);
  });

  it("should return 400 it type is empty", async () => {
   const response = await request(app).put(`/socialLink/${socialLink.id}`).send({
    url: "https://twitter.com",
    type: "",
   });

   expect(response.status).toBe(400);
  });

  it("should return 400 it url is empty", async () => {
   const response = await request(app).put(`/socialLink/${socialLink.id}`).send({
    url: "",
    type: "TWITTER",
   });

   expect(response.status).toBe(400);
  });

  it("should return 400 it url and type is empty", async () => {
   const response = await request(app).put(`/socialLink/${socialLink.id}`).send({
    url: "",
    type: "",
   });
   expect(response.status).toBe(400);
  });
 });
});
