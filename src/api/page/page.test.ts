import request from 'supertest';
import app from '../../server';
import fakeEmail from '../utils/randomEmailGenerator';
import { Page, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()


describe("/page", () => {
    afterEach(async () => {
        app.close();
    });

    describe("POST /", () => {
        test("should create a new page", async () => {
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

    describe("PUT /", () => {
        test("should update a page", async () => {
            let userId: string = "";
            const createdUser = await prisma.user.create({
                data: {
                    firstName: "pageupdatetest",
                    lastName: "pageupdatetest",
                    displayName: "pageupdatetest",
                    email: fakeEmail(),
                    residence: "ET",
                },
            });
            if (createdUser) {
                userId = createdUser.id;
            }

            const name = (Math.random() + 1).toString(36).substring(7)
            const page = {
                ownerId: userId,
                name: name,
                url: `https://jegool.com/${name.replace(/\s+/g, '').toLowerCase()}`
            } as Page

            const createdPage = await prisma.page.create({
                data: page,
                select: {
                    id: true,
                },
            });
            const res = await request(app).put(`/page/${createdPage.id}`).send({
                ownerId: createdPage.id,
                name: 'this is updated name'
            });
            expect(res.status).toBe(204);
        }, 10000);
    });

    describe("DELETE /", () => {
        test("should delete a page", async () => {
            let userId: string = "";
            const createdUser = await prisma.user.create({
                data: {
                    firstName: "pagedeletetest",
                    lastName: "pagedeletetest",
                    displayName: "pagedeletetest",
                    email: fakeEmail(),
                    residence: "ET",
                },
            });
            if (createdUser) {
                userId = createdUser.id;
            }

            const name = (Math.random() + 1).toString(36).substring(7)
            const page = {
                ownerId: userId,
                name: name,
                url: `https://jegool.com/${name.replace(/\s+/g, '').toLowerCase()}`
            } as Page

            const createdPage = await prisma.page.create({
                data: page,
                select: {
                    id: true,
                },
            });
            const res = await request(app).delete(`/page/${createdPage.id}`);
            expect(res.status).toBe(204);
        }, 10000);
    })
})