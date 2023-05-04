import request from "supertest";
import app from "../../server";
import fakeEmail from "../utils/randomEmailGenerator";


describe("/user", () => {
  afterEach(async () => {
    app.close();
  });

  describe("POST /", () => {
    test("should create a new user", async () => {
      const email = fakeEmail()
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
});
