import request from "supertest";
import app from "../../../app";

describe("Update Project", () => {
	it("should update a project", async () => {
		const project = {
			title: "Test Project",
			description: "Test Project Description",
			pageId: "1",
			visibleTo: ["1"],
		};

		const createdProject = await request(app).post("/project").send(project);

		const updatedProject = await request(app)
			.put(`/project/${createdProject.body.project.id}`)
			.send({
				name: "Updated Project",
				description: "Updated Project Description",
				pageId: "1",
				visibleTo: ["1"],
			});

		expect(updatedProject.status).toBe(204);
	});
});
