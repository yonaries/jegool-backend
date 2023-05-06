import request from 'supertest';
import app from '../../../app';
import fakeEmail from '../../utils/randomEmailGenerator';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()

const createPage = async (): Promise<{ id: string }> => {
    let pageId: string = "";
    let userId: string = "";

    const fakeName = () => (Math.random() + 1).toString(36).substring(7)

    const createdUser = await prisma.user.create({
        data: {
            firstName: "testPostUser",
            lastName: "testPostUser",
            displayName: "testPostUser",
            email: fakeEmail(),
            residence: "ET",
        },
        select: {
            id: true,
        },
    });

    if (createdUser) userId = createdUser.id;

    const createdPage = await prisma.page.create({
        data: {
            url: `www.jegool.com/${fakeName()}`,
            name: fakeName(),
            ownerId: userId,
        },
        select: {
            id: true,
        },
    });
    if (createdPage) pageId = createdPage.id;

    return { id: pageId }
};

describe("/post", () => {
    beforeEach(async () => {
        prisma.$connect();
    });

    afterEach(async () => {
        await prisma.$disconnect();
    });
    describe("POST /", () => {
        beforeAll(async () => {
            await prisma.post.deleteMany({});
            await prisma.page.deleteMany({});
            await prisma.user.deleteMany({});
        }, 200000);

        afterAll(async () => {
            await prisma.post.deleteMany({});
            await prisma.page.deleteMany({});
            await prisma.user.deleteMany({});
        }, 200000);
        test("should create a post", async () => {
            const { id } = await createPage();

            const res = await request(app).post('/post').send({
                pageId: id,
                title: "test title",
                type: "TEXT",
                caption: "test caption",
                visibleTo: ["member1", "member2"],
                scheduled: new Date().toISOString(),
                status: "SCHEDULED",
            });
            expect(res.status).toBe(201);
        }, 60000);

        test("should not create a post with wrong userId", async () => {

            const res = await request(app).post('/post').send({
                pageId: "userIdwrong",
                title: "test title",
                type: "TEXT",
                caption: "test caption",
                visibleTo: ["member1", "member2"],
                scheduled: new Date().toISOString(),
                status: "SCHEDULED",
            });
            expect(res.status).toBe(404);
        }, 60000);

        test("should not create a post with invalid inputs", async () => {
            const { id } = await createPage();

            const res = await request(app).post('/post').send({
                pageId: id,
                title: "test title",
                type: "ZIP",
                caption: "test caption",
                visibleTo: ["member1", "member2"],
                scheduled: new Date().toISOString(),
                status: "SCHEDULED",
            });
            expect(res.status).toBe(400);
        }, 60000);
    })

})