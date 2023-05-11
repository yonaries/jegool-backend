import request from "supertest";
import app from "../../app";
import { ContentType, Membership, Page, Post, PostStatus, PrismaClient, User } from "@prisma/client";

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

let owner: User;
let page: Page;
let membership: Membership;
let membership1: Membership;
let post: Post;
let post1: Post;

describe("/page", () => {
 beforeAll(async () => {
  await prisma.subscription.deleteMany();
  await prisma.post.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.page.deleteMany();
  await prisma.user.deleteMany();
 }, 200000);

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
  membership = await prisma.membership.create({
   data: {
    ...membershipData,
    pageId: page.id,
   },
  });

  membership1 = await prisma.membership.create({
   data: {
    ...membershipData1,
    pageId: page.id,
   },
  });

  post = await prisma.post.create({
   data: {
    pageId: page.id,
    title: "Post Title",
    type: "TEXT",
    caption: "Post Caption",
    status: "ACTIVE",
    visibleTo: [membership.id, membership1.id],
   },
  });
  post1 = await prisma.post.create({
   data: {
    pageId: page.id,
    title: "Post Title1",
    type: "TEXT",
    caption: "Post Caption1",
    visibleTo: [membership.id],
   },
  });
 }, 200000);

 describe("GET /:id/posts", () => {
  it("should return 200 OK", async () => {
   const res = await request(app).get(`/page/${page.id}/posts`);
   expect(res.status).toBe(200);
  });

  it("should return an array of posts", async () => {
   const res = await request(app).get(`/page/${page.id}/posts`);
   expect(res.body.posts).toBeDefined();
   expect(res.body.posts).toBeTruthy();
  });

  describe("Based on status", () => {
   const statuses = Object.keys(PostStatus);

   for (let i = 0; i < statuses.length; i++) {
    it(`should return 200 ${statuses[i]} posts`, async () => {
     const res = await request(app).get(`/page/${page.id}/posts?status=${statuses[i]}`);
     expect(res.status).toBe(200);
    });
   }

   it("should return 400 when wrong status is passed", async () => {
    const res = await request(app).get(`/page/${page.id}/posts?status=invalidType`);
    expect(res.status).toBe(400);
   });
  });
  describe("Based on type", () => {
   const types = Object.keys(ContentType);

   for (let i = 0; i < types.length; i++) {
    it(`should return 200 ${types[i]} posts`, async () => {
     const res = await request(app).get(`/page/${page.id}/posts?type=${types[i]}`);
     expect(res.status).toBe(200);
    });

    it("should return 400 when wrong type is passed", async () => {
     const res = await request(app).get(`/page/${page.id}/posts?type=invalidType`);
     expect(res.status).toBe(400);
    });
   }
  });

  describe("Based on visibleTo membership", () => {
   it("should return 2 posts visible to a membership", async () => {
    const res = await request(app).get(`/page/${page.id}/posts?visibleTo=${membership.id}`);
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBe(2);
   });
   it("should return 1 posts visible to a membership", async () => {
    const res = await request(app).get(`/page/${page.id}/posts?visibleTo=${membership1.id}`);
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBe(1);
   });
  });

  describe("Combined query", () => {
   it("should return 2 posts (visiblity & type) combined", async () => {
    const res = await request(app).get(`/page/${page.id}/posts?visibleTo=${membership.id}&type=text`);
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBe(2);
   });
   it("should return 0 posts (visiblity & type) combined", async () => {
    const res = await request(app).get(`/page/${page.id}/posts?visibleTo=${membership1.id}&type=file`);
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBe(0);
   });
   it("should return 2 posts all 3 combined", async () => {
    const res = await request(app).get(`/page/${page.id}/posts?visibleTo=${membership.id}&type=text&status=active`);
    expect(res.status).toBe(200);
    expect(res.body.posts.length).toBe(2);
   });
  });
 });
});
