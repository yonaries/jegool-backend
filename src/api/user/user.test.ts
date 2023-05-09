import request from "supertest";
import app from "../../app";
import {
  Membership,
  Page,
  PrismaClient,
  Subscription,
  User,
} from "@prisma/client";

const prisma = new PrismaClient();

const userData = {
  firstName: "sub",
  lastName: "sub",
  displayName: "sub",
  email: "sub@gmail.com",
  residence: "ET",
};

const ownerData = {
  firstName: "owner",
  lastName: "owner",
  displayName: "owner",
  email: "owner@gmail.com",
  residence: "ET",
};

const pageData = {
  // add owner Id
  name: "page",
  url: "www.page.com",
};

const membershipData = {
  // add page Id
  title: "membership",
  fee: 100,
  status: true,
};

let user: User;
let owner: User;
let page: Page;
let membership: Membership;
let subscription: Subscription;

describe("/user", () => {
  describe("USER /:id/subscriptions", () => {
    beforeAll(async () => {
      await prisma.transaction.deleteMany();
      await prisma.subscription.deleteMany();
      await prisma.membership.deleteMany();
      await prisma.page.deleteMany();
      await prisma.user.deleteMany();
    }, 200000);
    beforeAll(async () => {
      user = await prisma.user.create({
        data: userData,
      });

      owner = await prisma.user.create({
        data: ownerData,
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

      await request(app)
        .post("/subscription")
        .send({
          subscriberId: user.id,
          membershipId: membership.id,
        })
        .expect(201)
        .then((res) => {
          subscription = res.body.subscription;
        });
    });

    it("should return 404 if user not found", async () => {
      const res = await request(app).get("/user/123/subscriptions");
      expect(res.status).toBe(404);
    });

    it("should return 200 if user has subscriptions", async () => {
      const res = await request(app).get(`/user/${user.id}/subscriptions`);
      expect(res.status).toBe(200);
    });

    it("should return active subscriptions", async () => {
      const res = await request(app).get(
        `/user/${user.id}/subscriptions?status=active`
      );
      expect(res.status).toBe(200);
    });

    it("should return inactive subscriptions", async () => {
      const res = await request(app).get(
        `/user/${user.id}/subscriptions?status=inactive`
      );
      expect(res.status).toBe(200);
    });

    it("should return cancelled subscriptions", async () => {
      const res = await request(app).get(
        `/user/${user.id}/subscriptions?status=cancelled`
      );
      expect(res.status).toBe(200);
    });

    it("should return expired subscriptions", async () => {
      const res = await request(app).get(
        `/user/${user.id}/subscriptions?status=expired`
      );
      expect(res.status).toBe(200);
    });

    it("should return 400 if status is invalid", async () => {
      const res = await request(app).get(
        `/user/${user.id}/subscriptions?status=invalid`
      );
      expect(res.status).toBe(400);
    });
  });
});
