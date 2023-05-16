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
 describe("GET /:id", () => {
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

  it("should get a social link", async () => {
   const response = await request(app).get(`/socialLink/${socialLink.id}`);

   expect(response.status).toBe(200);
   expect(response.body.socialLink).toBeTruthy();
  });

  it("should return 404 if social link not found", async () => {
   const response = await request(app).get(`/socialLink/${socialLink.id}123`);

   expect(response.status).toBe(404);
   expect(response.body.error).toBeTruthy();
  });

  it("should return 404 if social link id is invalid", async () => {
   const response = await request(app).get(`/socialLink/123`);

   expect(response.status).toBe(404);
  });
 });
});
