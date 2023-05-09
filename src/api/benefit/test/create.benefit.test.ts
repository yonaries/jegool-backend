import { Membership, PrismaClient } from "@prisma/client";
import app from "../../../app";
import request from "supertest";

const prisma = new PrismaClient();

const createMembership = async () => {
	const payload = {
		title: "test membership",
		fee: 23.5,
		description: "tytytytytytytytytytytytytytytyg hajfdhjabfdjbajdbjha",
		status: false,
		coverImage: "http://test.com/test.png",
		pageId: "clhere4s40002q3e8jh992c76",
	};

	const res = await prisma.membership.create({
		data: payload,
	});
	return res.id;
};
describe("Benefit API", () => {
	beforeAll(async () => {
		await prisma.$connect();
		await prisma.membership.deleteMany();
		await prisma.benefit.deleteMany();
	}, 10000);
	describe("POST /benefit", () => {
		it("should return 201", async () => {
			const id = createMembership();

			const res = await request(app).post("/benefit").send({
				title: "test",
				description: "test",
				membershipId: id,
			});
			expect(res.status).toBe(201);
		}, 10000);
	});
	afterAll(async () => {
		await prisma.$disconnect();
	}, 10000);
});
