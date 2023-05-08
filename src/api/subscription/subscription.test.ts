import request from "supertest";
import app from "../../app";
import {
  Membership,
  Page,
  PrismaClient,
  Subscription,
  User,
} from "@prisma/client";
import dayjs from "dayjs";

const prisma = new PrismaClient();

const userData = {
  firstName: "test",
  lastName: "user",
  email: "sub@gmail.com",
  displayName: "test user",
  residence: "ET",
};

const pageData = {
  name: "test page",
  url: "www.testpage.com",
};

const membershipData = {
  title: "test membership",
  fee: 100,
  status: true,
};

let subscriber: User;
let owner: User;
let page: Page;
let membership: Membership;
let subscription: Subscription;

describe("/subscription", () => {
  beforeAll(async () => {
    subscriber = await prisma.user.create({
      data: {
        ...userData,
      },
    });

    owner = await prisma.user.create({
      data: {
        ...userData,
        email: "owner@gmail.com",
      },
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
  }, 200000);

  describe("POST /", () => {
    it("should return 201 if subscription is created successfully", async () => {
      const res = await request(app).post("/subscription").send({
        subscriberId: subscriber.id,
        membershipId: membership.id,
      });
      expect(res.status).toBe(201);
      expect(res.body.subscription).toHaveProperty("id");
    });

    it("should return 400 if subscriberId is not provided", async () => {
      const res = await request(app).post("/subscription").send({
        membershipId: membership.id,
      });
      expect(res.status).toBe(400);
    });

    it("should return 400 if membershipId is not provided", async () => {
      const res = await request(app).post("/subscription").send({
        subscriberId: subscriber.id,
      });
      expect(res.status).toBe(400);
    });

    it("should return 404 if subscriberId is invalid", async () => {
      const res = await request(app).post("/subscription").send({
        subscriberId: "invalid",
        membershipId: membership.id,
      });
      expect(res.status).toBe(404);
    });

    it("should return 404 if membershipId is invalid", async () => {
      const res = await request(app).post("/subscription").send({
        subscriberId: subscriber.id,
        membershipId: "invalid",
      });
      expect(res.status).toBe(404);
    });
  });

  describe("PUT /:id", () => {
    beforeAll(async () => {
      subscription = await prisma.subscription.create({
        data: {
          subscriberId: subscriber.id,
          membershipId: membership.id,
          status: "INACTIVE",
          expiryDate: dayjs().toISOString(),
        },
      });
    }, 200000);
    it("should return 200 if subscription is updated successfully with correct data", async () => {
      const res = await request(app)
        .put(`/subscription/${subscription.id}`)
        .send({
          status: "ACTIVE",
          expiryDate: dayjs().add(1, "month").toISOString(),
        });
      expect(res.status).toBe(200);
    });

    it("should return 200 if subscription is updated successfully with status only", async () => {
      const res = await request(app)
        .put(`/subscription/${subscription.id}`)
        .send({
          status: "ACTIVE",
        });
      expect(res.status).toBe(200);
    });

    it("should return 200 if subscription is updated successfully with expiryDate only", async () => {
      const res = await request(app)
        .put(`/subscription/${subscription.id}`)
        .send({
          expiryDate: dayjs().add(1, "month").toISOString(),
        });
      expect(res.status).toBe(200);
    });
    it("should return 400 if expiryDate is not valid", async () => {
      const res = await request(app)
        .put(`/subscription/${subscription.id}`)
        .send({
          expiryDate: dayjs().format("DD-MM-YYYY"),
        });
      expect(res.status).toBe(400);
    });

    it("should return 400 if both status and expiryDate not provided", async () => {
      const res = await request(app).put(`/subscription/${subscription.id}`);
      expect(res.status).toBe(400);
    });

    it("should return 400 if status is invalid", async () => {
      const res = await request(app)
        .put(`/subscription/${subscription.id}`)
        .send({
          status: "invalid",
        });
      expect(res.status).toBe(400);
    });

    it("should return 404 if subscription is not found", async () => {
      const res = await request(app).put(`/subscription/invalid`).send({
        status: "ACTIVE",
      });
      expect(res.status).toBe(404);
    });
  });

  afterAll(async () => {
    await prisma.subscription.deleteMany();
    await prisma.membership.deleteMany();
    await prisma.page.deleteMany();
    await prisma.user.deleteMany();
    await prisma.transaction.deleteMany();
  }, 200000);
});
