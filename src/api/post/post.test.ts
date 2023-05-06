import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../../app';
import fakeEmail from '../utils/randomEmailGenerator';


const prisma = new PrismaClient()

const createPost = async (): Promise<{ pageId: string, userId: string }> => {
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


    return { pageId, userId }
};

describe('/post', () => {

    beforeEach(async () => {
        prisma.$connect();
    });

    afterEach(async () => {
        await prisma.$disconnect();
    });

    it('should create a post', async () => {
        const { pageId, userId } = await createPost();
        const res = await request(app).post('/post').send({
            pageId,
            title: "testPost",
            type: "TEXT",
            caption: "testPost",
        });
        expect(res.status).toBe(201);
    }, 50000);


})