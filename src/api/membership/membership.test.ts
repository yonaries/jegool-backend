import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let membershipId = "";
let pageId = "";
let userId = "";
const createMembership = async () => {
    const createdUser = await prisma.user.create({
      data: {
        firstName: "testMembershipUser",
        lastName: "testMembershipUser",
        displayName: "testMembershipUser",
        email: "testMembershipUser@gmail.com",
        residence: "ET",
      },
    });
    if (createdUser) userId = createdUser.id;
    const createdPage = await prisma.page.create({
      data: {
        url: "www.jegool.com/pageTestMembership",
        name: "pageTestMembership",
        ownerId: userId,
      },
    });
    if (createdPage) pageId = createdPage.id;

    const createdMembership = await prisma.membership.create({
      data: {
        title: "membershipTest",
        fee: 1000,
        pageId: pageId,
        status: true,
      },
    });
    if (createdMembership) membershipId = createdMembership.id;
};

describe("/membership", () => {
  beforeEach(async () => {
    prisma.$connect();
  });

  afterEach(async () => {
    await prisma.$disconnect();
  });

  describe("PUT /", () => {
    beforeAll(async () => {
      await prisma.membership.deleteMany({});
      await prisma.page.deleteMany({});
      await prisma.user.deleteMany({});
    }, 200000);
    afterAll(async () => {
      await prisma.membership.deleteMany({});
      await prisma.page.deleteMany({});
      await prisma.user.deleteMany({});
    }, 200000);

    test("should return 200 if membership is updated", async () => {
      await createMembership();
      const res = await request(app)
        .put("/membership/" + membershipId)
        .send({
          title: "membershipTest1",
          fee: 1000,
          pageId: pageId,
          status: true,
        })
        
        expect(res.status).toBe(200);
    }, 1000000);

    test("should return 404 if nedded data is not provided", () => {
      return request(app)
        .put("/membership/" + membershipId)
        .send({})
        .expect(400);
    });
    test("should return 404 if wrong id is provided", () => {
      return request(app)
        .put("/membership" + "wrongID")
        .send({})
        .expect(404);
    });
  });
});
