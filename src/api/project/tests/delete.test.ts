import request from "supertest";
import app from "../../../app";
import { PrismaClient, Project } from "@prisma/client";

const prisma = new PrismaClient();

const createProject = async (): Promise<string> => {
	const payload = {
		pageId: "clhere4s40002q3e8jh992c76",
		title: "holla",
		coverImage: "https://test.com/test.png",
		description: "test description",
		visibleTo: ["member1"],
	};
	const project = await request(app).post("/project").send(payload);
	return project.body.project.id;
};

describe("DELETE /api/project/:id", () => {
	it("should return 200 OK", async () => {
		const id = await createProject();

		const res = await request(app).delete(`/project/${id}`);
		expect(res.status).toBe(204);
	}, 100000);

	it("should return 404 if project not found", async () => {
		const res = await request(app).delete("/project/123");
		expect(res.status).toBe(404);
	}, 100000);

	afterAll(async () => {
		await prisma.project.deleteMany();
	}, 100000);
});
