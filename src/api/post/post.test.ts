import request from 'supertest';
import app from '../../server';
import fakeEmail from '../utils/randomEmailGenerator';
import { Page, PrismaClient } from '@prisma/client';
import { log } from 'console';

const prisma = new PrismaClient()

describe('POST /api/post', () => {
    afterEach(async () => {
        app.close();
    });

    describe("POST /", () => {
        test('create post', async () => {
            let userId: string = "";

            const createdUser = await prisma.user.create({
                data: {
                    firstName: "create post",
                    lastName: "create post",
                    displayName: "create post",
                    email: fakeEmail(),
                    residence: "ET",
                },
            });

            if (createdUser) userId = createdUser.id;

            const name = (Math.random() + 1).toString(36).substring(7)
            const page = {
                ownerId: userId,
                name: name,
                url: `https://jegool.com/${name.replace(/\s+/g, '').toLowerCase()}`
            } as Page

            let pageId: string = "";
            const createdPage = await prisma.page.create({
                data: page,
                select: {
                    id: true,
                },
            });

            if (createdPage) pageId = createdPage.id;

            const res = await request(app).post('/api/post').send({
                pageId: pageId,
                title: 'post test title',
                type: 'TEXT',
                caption: 'post test caption',
                scheduled: Date.now(),
                visibleTo: ['dadfadf', 'adfadsf'],
            })
            log(res.status)
            if (!createdPage) expect(res.status).toBe(400)
            else expect(res.status).toBe(201)

        }, 10000)
    })
})