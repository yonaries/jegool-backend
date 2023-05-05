import request from 'supertest';
import app from '../../server';
import fakeEmail from '../utils/randomEmailGenerator';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


describe("/page", () => {
    afterEach(async () => {
        app.close();
    });

    describe("POST /", () => {
        test("should create a new page", async () => {
            const email = fakeEmail()
            let userId: string = "";
            const createdUser = await prisma.user.create({
                data: {
                    firstName: "pagetest",
                    lastName: "pagetest",
                    displayName: "pagetest",
                    email: fakeEmail(),
                    residence: "ET",
                },
            });
            if (createdUser) {
                userId = createdUser.id;
            }

            const name = (Math.random() + 1).toString(36).substring(7)
            const res = await request(app).post("/page").send({
                ownerId: userId,
                name: name
            });
            expect(res.status).toBe(201);
        }, 10000);
    });

    describe("POST /", () => {
        test("should fail to create a new page with invalid request", async () => {
            const res = await request(app).post("/page").send({
            });
            expect(res.status).toBe(400);
        });
    });
})