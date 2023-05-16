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
 describe("DELETE /:id", () => {
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

  it("should delete a social link", async () => {
   const response = await request(app).delete(`/socialLink/${socialLink.id}`);

   expect(response.status).toBe(200);
  });

  it("should return 400 if social link id is invalid", async () => {
   const response = await request(app).delete(`/socialLink/   invalidId`);

   expect(response.status).toBe(404);
  });
 });
});
