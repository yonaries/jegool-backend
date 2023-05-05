import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../../../app';
import fakeEmail from '../../utils/randomEmailGenerator';

const prisma = new PrismaClient();

const createPost = async (): Promise<{ pageId: string, userId: string, postId: string }> => {
    let pageId: string = "";
    let userId: string = "";
    let postId: string = "";

    const date = new Date().toISOString()
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

    const createdPost = await request(app).post('/post').send({
        pageId: pageId,
        title: `post ${fakeName()}`,
        type: 'TEXT',
        caption: 'post test caption',
        scheduled: date,
        visibleTo: ['member1', 'member2'],
    })

    postId = createdPost.body.post.id

    return { pageId, userId, postId }
};
describe("/post", () => {

    beforeEach(async () => {
        prisma.$connect();
    });

    afterEach(async () => {
        await prisma.$disconnect();
    });
    describe("PUT /", () => {
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
        test("update post", async () => {
            const { pageId, userId, postId } = await createPost();

            const res = await request(app)
                .put(`/post/${postId}`)
                .send({
                    userId: userId,
                    pageId: pageId,
                    title: "post test title updated",
                    type: "TEXT",
                    caption: "post test caption updated",
                    visibleTo: ["member2"],
                });
            expect(res.status).toBe(204);
        }, 50000);

        test("update post with wrong id", async () => {
            const { pageId, userId, postId } = await createPost();

            const res = await request(app)
                .put(`/post/${postId}wrong`)
                .send({
                    userId: userId,
                    pageId: pageId,
                    title: "post test title updated",
                    type: "TEXT",
                    caption: "post test caption updated",
                    visibleTo: ["member2", "member1"],
                });
            expect(res.status).toBe(404);
        }, 50000);

        test("update post with wrong userId", async () => {
            const { pageId, userId, postId } = await createPost();

            const res = await request(app)
                .put(`/post/${postId}`)
                .send({
                    userId: `${userId}wrong`,
                    pageId: pageId,
                    title: "post test title updated",
                    type: "TEXT",
                    caption: "post test caption updated",
                    visibleTo: ["member2", "member1"],
                });
            expect(res.status).toBe(403);
        }, 50000);

        test("update post with wrong pageId", async () => {
            const { pageId, userId, postId } = await createPost();

            const res = await request(app)
                .put(`/post/${postId}`)
                .send({
                    userId: userId,
                    pageId: `${pageId}wrong`,
                    title: "post test title updated",
                    type: "TEXT",
                    caption: "post test caption updated",
                    visibleTo: ["member2", "member1"],
                });
            expect(res.status).toBe(403);
        }, 50000);
    });
})