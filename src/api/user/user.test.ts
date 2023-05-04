import request from "supertest";
import app from "../../server";
import fakeEmail from "../utils/randomEmailGenerator";


describe("/user", () => {
  afterEach(async () => {
    app.close();
  });

  describe("GET /", () => {
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
});
