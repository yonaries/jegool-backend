import request from 'supertest';
import app from '../../server';


describe("/page", () => {
    afterEach(async () => {
        app.close();
    });

    describe("POST /", () => {
        test("should create a new page", async () => {
            const res = await request(app).post("/page").send({
                ownerId: "clh920wpy000cq3yzcn7ijqce",
                name: "yonaries",
            });
            expect(res.status).toBe(201);
        });
    });

    describe("POST /", () => {
        test("should fail to create a new page with invalid request", async () => {
            const res = await request(app).post("/page").send({
            });
            expect(res.status).toBe(400);
        });
    });
})