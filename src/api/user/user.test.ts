import request from "supertest";
import app from "../../server";
import fakeEmail from "../utils/randomEmailGenerator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/user", () => {
  afterEach(async () => {
    app.close();
  });

  describe("POST /", () => {
    test("should create a new user", async () => {
      const email = fakeEmail();
      const res = await request(app).post("/user").send({
        firstName: "test",
        lastName: "test",
        displayName: "test",
        email: email,
        residence: "Et",
      });
      expect(res.status).toBe(201);
    });
  });

  describe("POST /", () => {
    test("should fail to create a new user with invalid request", async () => {
      const res = await request(app).post("/user").send({
        firstName: "test",
        lastName: "test",
        displayName: "test",
        email: "test",
        residence: "Et",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("GET /", () => {
    test("should get all users", async () => {
      const res = await request(app).get("/user");
      expect(res.status).toBe(200);
    });
  });

  describe("DELETE /:id", () => {
    test("should delete a user", async () => {
      let userId: string = "";
      const createdUser = await prisma.user.create({
        data: {
          firstName: "deletetest",
          lastName: "deletetest",
          displayName: "deletetest",
          email: fakeEmail(),
          residence: "Et",
        },
      });
      if (createdUser) {
        userId = createdUser.id;
      }
      const res = await request(app).delete(`/user/${userId}`);
      console.log("USER_ID ::: ", userId);
      expect(res.status).toBe(200);
    }, 50000);

    test("should fail to delete a user with invalid id", async () => {
      const res = await request(app).delete("/user/0");
      expect(res.status).toBe(404);
    });
  });
});
