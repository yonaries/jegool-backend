import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../../../app";

const prisma = new PrismaClient();

const createBenefit = async () => {
	const membership = await prisma.membership.create({
		data: {
			title: "uiiiiiiiiiiiii",
			fee: 205.45,
			pageId: "adfafafafafafaf",
		},
		select: {
			id: true,
		},
	});

	const benefit = await prisma.benefit.create({
		data: {
			title: "test",
			description: "fadfadfdffdfdfdfdfdfdfdfffffffffffffffffffffffffffffff",
			membershipId: membership.id,
		},
	});
	return { id: benefit.id, membership: membership.id };
};

describe("Benefit API", () => {
	describe("GET /benefit/:id", () => {
		test("should get benefit by id with response of status 200", async () => {
			const { id } = await createBenefit();

			const res = await request(app).get(`/benefit/${id}`);
			expect(res.status).toBe(200);
		}, 10000);

		test("should not get benefit by invalid id with response of status 404", async () => {
			const res = await request(app).get("/benefit/invalid");
			expect(res.status).toBe(404);
		}, 10000);

		test("should get all benefit from db with response of status 200", async () => {
			const res = await request(app).get("/benefit/all");
			expect(res.status).toBe(200);
		}, 10000);
	});

	describe("GET /benefit/?query", () => {
		test("should not get benefit with invalid query and respond 400 status", async () => {
			const res = await request(app).get("/benefit");
			expect(res.status).toBe(400);
		}, 10000);

		test("should get benefit by membership id with response of status 200", async () => {
			const { membership } = await createBenefit();
			const res = await request(app).get(
				`/benefit/?membershipId=${membership}`,
			);
			expect(res.status).toBe(200);
		}, 10000);
	});
});
