import request from "supertest";
import app from "../../app";
import { DonationItem, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("DonationItem GET /donationItem", () => {
 beforeAll(async () => {
  await prisma.donationItem.deleteMany();

  await prisma.donationItem.createMany({
   data: [
    {
     name: "My DonationItem",
     price: 1000,
     image: "my-donationItem.com",
     status: true,
    },
    {
     name: "My DonationItem1",
     price: 1001,
     image: "my-donationItem.com",
     status: true,
    },
    {
     name: "My DonationItem2",
     price: 1002,
     image: "my-donationItem.com",
     status: true,
    },
   ],
  });
 });

 it("should get all donationItems", async () => {
  const res = await request(app).get(`/donationItem`);

  expect(res.status).toBe(200);
  expect(res.body.donationItems).toHaveLength(3);
 });

 it("should return [] if donationItems not found", async () => {
  await prisma.donationItem.deleteMany();
  const res = await request(app).get(`/donationItem`);
  expect(res.status).toBe(200);
  expect(res.body.donationItems).toHaveLength(0);
 });

 afterAll(async () => {
  await prisma.donationItem.deleteMany();
 });
});
