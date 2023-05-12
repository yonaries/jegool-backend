import request from "supertest";
import app from "../../app";
import { ContentType, Membership, Page, Post, PostStatus, PrismaClient, Project, User } from "@prisma/client";

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
let project: Project;
let project1: Project;

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

  project = await prisma.project.create({
   data: {
    pageId: page.id,
    title: "Project Title",
    visibleTo: [membership.id, membership1.id],
    coverImage: "https://jegool.com/johndoespage",
    description: "Project Description",
    status: "ACTIVE",
   },
  });
  project1 = await prisma.project.create({
   data: {
    pageId: page.id,
    title: "Project Title1",
    visibleTo: [membership.id],
    coverImage: "https://jegool.com/johndoespage",
    description: "Project Description1",
    status: "SCHEDULED",
   },
  });
 }, 200000);

 describe("GET /:id/projects", () => {
  it("should return 200 OK", async () => {
   const res = await request(app).get(`/page/${page.id}/projects`);
   expect(res.status).toBe(200);
  });

  it("should return an array of projects", async () => {
   const res = await request(app).get(`/page/${page.id}/projects`);
   expect(res.body.projects).toBeDefined();
   expect(res.body.projects).toBeTruthy();
  });

  describe("Based on status", () => {
   const statuses = Object.keys(PostStatus);

   for (let i = 0; i < statuses.length; i++) {
    it(`should return 200 ${statuses[i]} projects`, async () => {
     const res = await request(app).get(`/page/${page.id}/projects?status=${statuses[i]}`);
     expect(res.status).toBe(200);
    });
   }

   it("should return 1 project when status is ACTIVE", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?status=ACTIVE`);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(1);
   });

   it("should return 1 project when status is SCHEDULED", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?status=SCHEDULED`);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(1);
   });

   it("should return 400 when wrong status is passed", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?status=invalidType`);
    expect(res.status).toBe(400);
   });
  });

  describe("Based on visibleTo membership", () => {
   it("should return 2 projects visible to a membership", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?visibleTo=${membership.id}`);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(2);
   });
   it("should return 1 projects visible to a membership", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?visibleTo=${membership1.id}`);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(1);
   });

   it("should return 400 when wrong membership id is passed", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?visibleTo=invalidId`);
    expect(res.status).toBe(400);
   });
  });

  describe("Combined query", () => {
   it("should return 1 projects visible to a membership and status", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?visibleTo=${membership.id}&status=ACTIVE`);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(1);
   });

   it("should return 1 projects visible to a membership and status", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?visibleTo=${membership.id}&status=SCHEDULED`);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(1);
   });

   it("should return 0 projects visible to a membership and status", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?visibleTo=${membership.id}&status=BANNED`);
    expect(res.status).toBe(200);
    expect(res.body.projects.length).toBe(0);
   });

   it("should return 400 when wrong membership id is passed", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?visibleTo=invalidId&status=ACTIVE`);
    expect(res.status).toBe(400);
   });

   it("should return 400 when wrong status is passed", async () => {
    const res = await request(app).get(`/page/${page.id}/projects?visibleTo=${membership.id}&status=invalidType`);
    expect(res.status).toBe(400);
   });
  });
 });
});
