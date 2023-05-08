import request from "supertest";
import app from "../../../app";

describe("Update Project", () => {
	it("should update a project", async () => {
		const project = {
			title: "Test Project",
			description: "Test Project Description",
			coverImage: "https://test.com/test.png",
			pageId: "clhere4s40002q3e8jh992c76",
			visibleTo: ["1"],
		};

		const createdProject = await request(app).post("/project").send(project);

		const updatedProject = await request(app)
			.put(`/project/${createdProject.body.project.id}`)
			.send({
				title: "Updated Project",
				description: "Updated Project Description",
				visibleTo: ["1"],
			});

		expect(updatedProject.status).toBe(204);
	}, 10000);

	it("should return an error if the project id is not found", async () => {
		const updatedProject = await request(app)
			.put("/project/5f7d2a8a1c9d440000d3c9a0")
			.send({
				title: "Updated Project",
				description: "Updated Project Description",
				visibleTo: ["1"],
			});

		expect(updatedProject.status).toBe(404);
	}, 10000);
});
