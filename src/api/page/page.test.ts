import request from 'supertest';
import app from '../../server';


describe("/page", () => {
    afterEach(async () => {
        app.close();
    });

    describe("POST /", () => {
        test("should fail to create a new page with invalid request", async () => {
            const res = await request(app).post("/page").send({
            });
            expect(res.status).toBe(400);
        });
    });
})