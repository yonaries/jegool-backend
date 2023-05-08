import app from "../../../app";
import request from "supertest";

const createProject = async (): Promise<{
	id: string;
	pageId: string;
	membershipId: string;
}> => {
	const randomName = () => Math.random().toString(36).substring(10);

	const user = {
		email: `${randomName()}@test.com`,
		displayName: "test",
		fullName: "test",
		lastNames: "test",
		residence: "Earth",
	};

	const userResponse = await request(app).post("/user").send(user);

	const page = {
		url: `https://test.com/${randomName()}`,
		name: randomName(),
		ownerId: userResponse.body.user.id,
		status: "BANNED",
	};

	const pageResponse = await request(app).post("/page").send(page);

	const membership = {
		title: "Octopus",
		fee: 150,
		status: false,
		coverImage: "https://test.com/test.jpg",
		pageId: pageResponse.body.page.id,
	};

	const membershipResponse = await request(app)
		.post("/membership")
		.send(membership);

	const project = {
		title: "test project",
		description: "test project description",
		pageId: pageResponse.body.page.id,
		visibleTo: [`${membershipResponse.body.id}`],
		coverImage: "https://test.com/test.jpg",
	};

	const projectResponse = await request(app).post("/project").send(project);

	return {
		id: projectResponse.body.project.id,
		pageId: pageResponse.body.page.id,
		membershipId: membershipResponse.body.id,
	};
};

describe("GET /project", () => {
	test("should get a project", async () => {
		const { id } = await createProject();
		const getResponse = await request(app).get(`/project/${id}`);
		expect(getResponse.status).toBe(200);
	}, 50000);

	test("should get all projects", async () => {
		const getResponse = await request(app).get("/project/all");
		expect(getResponse.status).toBe(200);
	}, 50000);

	test("should return 404 if project not found", async () => {
		const response = await request(app).get("/project/invalid project id");
		expect(response.status).toBe(404);
	}, 50000);

	test("should get project by page id", async () => {
		const { pageId } = await createProject();
		const getResponse = await request(app).get(`/project/?pageId=${pageId}`);
		expect(getResponse.status).toBe(200);
	}, 50000);

	test("should return 404 if page not found", async () => {
		const response = await request(app).get("/project/?pageId=invalid page id");
		expect(response.status).toBe(404);
	}, 50000);

	test("should get project by membership id", async () => {
		const { membershipId } = await createProject();
		const getResponse = await request(app).get(
			`/project/?membershipId=${membershipId}`,
		);
		expect(getResponse.status).toBe(200);
	}, 50000);

	test("should return 404 if membership not found", async () => {
		const response = await request(app).get(
			"/project/?membershipId=invalid membership id",
		);
		expect(response.status).toBe(404);
	}, 50000);

	test("should return 400 if query is invalid", async () => {
		const response = await request(app).get(
			"/project/?invalidQuery=invalidQuery",
		);
		expect(response.status).toBe(400);
	}, 50000);

	test("should return 400 if query is empty", async () => {
		const response = await request(app).get("/project/");
		expect(response.status).toBe(400);
	}, 50000);

	// afterAll(async () => {
	// 	await request(app).delete("/project");
	// 	await request(app).delete("/membership");
	// 	await request(app).delete("/page");
	// }, 50000);
});
