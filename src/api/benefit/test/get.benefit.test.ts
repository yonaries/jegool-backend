import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../../../app";

const prisma = new PrismaClient();

const createBenefit = async () => {
	const benefit = await prisma.benefit.create({
		data: {
			title: "test",
			description: "fadfadfdffdfdfdfdfdfdfdfffffffffffffffffffffffffffffff",
			membershipId: "wewewewewe",
		},
	});
	return benefit.id;
};

describe("Benefit API", () => {
	describe("GET /benefit/:id", () => {
		test("should get benefit by id with response of status 200", async () => {
			const id = await createBenefit();

			const res = await request(app).get(`/benefit/${id}`);
			expect(res.status).toBe(200);
		}, 10000);

		test("should not get benefit by invalid id with response of status 404", async () => {
			const res = await request(app).get("/benefit/invalid");
			expect(res.status).toBe(404);
		}, 10000);
		test("should get all benefit from db with response of status 200", async () => {
			const res = await request(app).get("/benefit/");
			expect(res.status).toBe(200);
		}, 10000);

		afterAll(async () => {
			await prisma.benefit.deleteMany();
			await prisma.membership.deleteMany();
			await prisma.page.deleteMany();
			await prisma.user.deleteMany();
		}, 10000);
	});
});
