import request from "supertest";
import app from "../../server";
import { User, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
let server = app;

describe("/user", () => {
  afterEach(async () => {
    await app.close();
    // await prisma.user.deleteMany();
  });

  describe("GET /", () => {
    test("should create a new user", async () => {
      const res = await request(app).post("/user").send({
        firstName: "test",
        lastName: "test",
        displayName: "test",
        email: "re@gmail.com",
        residence: "Et",
      });
      expect(res.status).toBe(200);
    });
  });
});
