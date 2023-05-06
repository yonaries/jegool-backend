import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../../../app';
import fakeEmail from '../../utils/randomEmailGenerator';


const prisma = new PrismaClient()

const createPost = async (): Promise<{ pageId: string, userId: string, postId: string }> => {
    let pageId: string = "";
    let userId: string = "";
    let postId: string = ""

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
        status: 'SCHEDULED',
        visibleTo: ['member1', 'member2'],
    })

    postId = createdPost.body.post.id

    return { pageId, userId, postId }
};

describe('/post', () => {

    beforeEach(async () => {
        prisma.$connect();
    });

    afterEach(async () => {
        await prisma.$disconnect();
    });

    describe("GET /", () => {

        test("get post", async () => {
            const { pageId, userId, postId } = await createPost();

            const res = await request(app).get(`/post/${postId}`).send();
            expect(res.status).toBe(200);
        }, 60000);

        test("get post with wrong id", async () => {
            const { pageId, userId, postId } = await createPost();

            const res = await request(app)
                .get('/post/abcde12345')
                .send();
            expect(res.status).toBe(404);
        }, 60000);

        test("get posts by pageId", async () => {
            const { pageId, userId, postId } = await createPost();

            const res = await request(app).get(`/post/?pageId=${pageId}`).send();
            expect(res.status).toBe(200);
        }, 60000);

        test("get all posts", async () => {
            const { pageId, userId, postId } = await createPost();

            const res = await request(app).get("/post").send();
            expect(res.status).toBe(200);
        }, 60000);
    })
})