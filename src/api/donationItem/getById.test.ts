import request from "supertest";
import app from "../../app";
import { DonationItem, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let donationItem: DonationItem;

describe("DonationItem GET /donationItem/:id", () => {
 beforeAll(async () => {
  await prisma.donationItem.deleteMany();

  donationItem = await prisma.donationItem.create({
   data: {
    name: "My DonationItem",
    price: 1000,
    image: "my-donationItem.com",
    status: true,
   },
  });
 });

 it("should get donationItem by id", async () => {
  const res = await request(app).get(`/donationItem/${donationItem.id}`);

  expect(res.status).toBe(200);
  expect(res.body.donationItem).toHaveProperty("id");
 });

 it("should return 404 if donationItem not found", async () => {
  const res = await request(app).get(`/donationItem/123456`);
  expect(res.status).toBe(404);
 });

 afterAll(async () => {
    await prisma.donationItem.deleteMany();
 });
});
