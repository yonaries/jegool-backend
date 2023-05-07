import { Page, PrismaClient } from "@prisma/client";
import app from "../../../app";
import request from "supertest";

const prisma = new PrismaClient();

const createPage = async (): Promise<{ id: string }> => {
    const randomName = () => Math.random().toString(36).substring(7);

    const page = {
        url: `https://test.com/${randomName()}`,
        name: randomName(),
        ownerId: randomName(),
        status: "BANNED",
    };

    const response = await request(app).post("/page").send(page);
    return { id: response.body.page.id };
};

describe("POST /project", () => {
    test("should create a project", async () => {
        const { id } = await createPage();

        const project = {
            title: "test project",
            description: "test project description",
            pageId: id,
            visibleTo: ["test visible to"],
            coverImage: "https://test.com/test.jpg",
        };

        const response = await request(app).post("/project").send(project);

        expect(response.status).toBe(201);
    }, 10000);

    test("should return 404 if page not found", async () => {
        const project = {
            title: "test project",
            description: "test project description",
            pageId: "invalid page id",
            visibleTo: ["test visible to"],
            coverImage: "https://test.com/test.jpg",
        };

        const response = await request(app).post("/project").send(project);

        expect(response.status).toBe(404);
    }, 10000);

    test("should return 400 if validation fails", async () => {
        const { id } = await createPage();

        const project = {
            title: "test project",
            description: "test project description",
            pageId: id,
            visibleTo: ["test visible to"],
            coverImage: "invalid url",
        };

        const response = await request(app).post("/project").send(project);

        expect(response.status).toBe(400);
    }, 10000);

    afterAll(async () => {
        await prisma.project.deleteMany();
        await prisma.page.deleteMany();
        await prisma.$disconnect();
    }, 10000);
});
