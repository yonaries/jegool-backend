import request from "supertest";
import app from "../../app";
import { Subscription, PrismaClient } from "@prisma/client";

const userData = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@gmail.com",
  displayName: "johndoe",
  residence: "ET",
};
const prisma = new PrismaClient();

let subscriber: any;
let pageOwner: any;
let page: any;
let membership: any;
let subscriptionData: any;
let subscription: any;

describe("subscription", () => {
  beforeAll(async () => {
    // create a subscriber
    subscriber = await prisma.user.create({ data: userData });
    // create a pageOwner
    pageOwner = await prisma.user.create({
      data: { ...userData, email: "abcd@gmail.com" },
    });

    // create a page
    page = await prisma.page.create({
      data: {
        ownerId: pageOwner.id,
        name: "John Doe Page",
        url: "https://johndoe.com",
      },
    });
    // create a membership
    membership = await prisma.membership.create({
      data: {
        title: "Gold",
        fee: 100,
        pageId: page.id,
      },
    });
  }, 200000);

  describe("POST /subscription", () => {
    it("should create a subscription", async () => {
      subscriptionData = {
        subscriberId: subscriber.id,
        membershipId: membership.id,
      }; 
      const res = await request(app)
        .post("/subscription")
        .send(subscriptionData);
      // console.log(res);
      expect(res.status).toBe(201);
      expect(res.body.subscription).toBeTruthy();
      subscription = res.body.subscription;
      expect(res.body.subscription.id).toBeTruthy();
    }, 200000);

    it("should return 400 if subscriberId is not provided", async () => {
      subscriptionData = {
        membershipId: membership.id,
      };
      const res = await request(app)
        .post("/subscription")
        .send(subscriptionData);
      expect(res.status).toBe(400);
    });

    it("should return 400 if membershipId is not provided", async () => {
      subscriptionData = {
        subscriberId: subscriber.id,
      };
      const res = await request(app)
        .post("/subscription")
        .send(subscriptionData);
      expect(res.status).toBe(400);
    });

    it("should return 404 if subscriber is not found", async () => {
      subscriptionData = {
        subscriberId: "123",
        membershipId: membership.id,
      };
      const res = await request(app)
        .post("/subscription")
        .send(subscriptionData);
      expect(res.status).toBe(404);
    });

    it("should return 404 if membership is not found", async () => {
      subscriptionData = {
        subscriberId: subscriber.id,
        membershipId: "123",
      };
      const res = await request(app)
        .post("/subscription")
        .send(subscriptionData);
      expect(res.status).toBe(404);
    });

    it("should return 400 if subscriber is already subscribed to this membership", async () => {
      subscriptionData = {
        subscriberId: subscriber.id,
        membershipId: membership.id,
      };
      const res = await request(app)
        .post("/subscription")
        .send(subscriptionData);
      expect(res.status).toBe(400);
    });
  });

  describe("GET /subscription/:id", () => {
    it("should return a subscription if valid id is passed", async () => {
      const res = await request(app).get("/subscription/" + subscription.id);

      expect(res.status).toBe(200);
      expect(res.body.subscription).toBeTruthy();
      expect(res.body.subscription.id).toBeTruthy();
    }, 200000);

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(app).get("/subscription/123");

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
