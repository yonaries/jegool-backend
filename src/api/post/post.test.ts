import request from 'supertest';
import app from '../../app';
import fakeEmail from '../utils/randomEmailGenerator';
import { Page, PrismaClient } from '@prisma/client';


const prisma = new PrismaClient()

describe('POST /api/post', () => {
    describe("DELETE /", () => {
        test('delete post', async () => {
            let userId: string = "";

            const createdUser = await prisma.user.create({
                data: {
                    firstName: "delete post",
                    lastName: "delete post",
                    displayName: "delete post",
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

            const date = new Date().toISOString()

            const createdPost = await request(app).post('/post').send({
                pageId: pageId,
                title: 'post test title',
                type: 'TEXT',
                caption: 'post test caption',
                scheduled: date,
                visibleTo: ['member1', 'member2'],
            })
            expect(createdPost.status).toBe(201)

            const res = await request(app).delete(`/post/${createdPost.body.post.id}`).send({
                pageId: pageId,
                user: {
                    uid: userId
                }
            })

            expect(res.status).toBe(204)

        }, 50000)
    })
})