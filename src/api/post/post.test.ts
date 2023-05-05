import request from 'supertest';
import app from '../../server';
import fakeEmail from '../utils/randomEmailGenerator';
import { Page, PrismaClient } from '@prisma/client';

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

            const res = await request(app).post('/api/post').send({
                pageId: createdPage.id,
                title: 'test title',
                type: 'TEXT',
                caption: 'test caption',
            })
            expect(res.status).toBe(201)

        }, 10000)
    })
})