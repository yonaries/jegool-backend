import request from "supertest";
import app from "../../server";
import fakeEmail from "../utils/randomEmailGenerator";
import { Page, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/membership", () => {
  afterEach(async () => {
    app.close();
  });

  describe("POST /", () => {
    let userId: string = "";
    let pageId: string = "";
    beforeAll(async () => {
      await prisma.membership.deleteMany({
        where: {
          title: "membershipTest",
        },
      });
      await prisma.page.deleteMany({
        where: {
          name: "membershiptest",
        },
      });
      await prisma.user.deleteMany({
        where: {
          firstName: "membershiptest",
        },
      });

      const createdUser = await prisma.user.create({
        data: {
          firstName: "membershiptest",
          lastName: "membershiptest",
          displayName: "membershiptest",
          email: fakeEmail(),
          residence: "ET",
        },
      });
      if (createdUser) {
        userId = createdUser.id;

        const newPage = await prisma.page.create({
          data: {
            name: "membershiptest",
            ownerId: createdUser.id,
            url: "membershiptest",
          },
        });
        if (newPage) pageId = newPage.id;
      }
    }, 100000);

    test("should create a new membership", async () => {
      const res = await request(app).post("/membership").send({
        title: "membershipTest",
        fee: 100,
        status: true,
        coverImage: "https://www.google.com",
        description: "membershipTest edssdfd sdcdscsdfdsfsd",
        pageId: pageId,
      });
      expect(res.status).toBe(201);
    }, 10000);

    test("should fail to create a new membership with invalid request", async () => {
      const res = await request(app).post("/membership").send({});
      expect(res.status).toBe(400);
    }, 10000);
  });
});
