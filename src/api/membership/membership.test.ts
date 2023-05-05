import request from "supertest";
import app from "../../server";
import { Membership, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/membership", () => {
  let membershipId = "";
  let pageId = "";
  let userId = "";
  beforeAll(async () => {
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
    console.log("userId ::: ", userId);
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
        fee: 100,
        pageId: pageId,
        status: true,
      },
    });
    if (createdMembership) membershipId = createdMembership.id;
  }, 200000);

  afterAll(async () => {
    await prisma.membership.delete({
      where: {
        id: membershipId,
      },
    });
    await prisma.page.delete({
      where: {
        id: pageId,
      },
    });
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }, 100000);

  afterEach(async () => {
    await app.closeAllConnections();
  });
  describe("PUT /:id", () => {
    test("should return 200 if membership is updated", async () => {
      const res = await request(app)
        .put("/membership/" + membershipId)
        .send({
          title: "membershipTest1",
          fee: 1000,
          pageId: pageId,
          status: true,
        });

      expect(res.status).toBe(200);
    });

    test("should return 400 if nedded data is not provided", async () => {
      const res = await request(app)
        .put("/membership" + membershipId)
        .send({});
      expect(res.status).toBe(400);
    });
  });
});
