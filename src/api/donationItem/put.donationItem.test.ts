import request from "supertest";
import app from "../../app";
import { DonationItem, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

let donationItem: DonationItem;

describe("DonationItem PUT /donationItem/:id", () => {
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

 it("should update donationItem by id", async () => {
  const res = await request(app).put(`/donationItem/${donationItem.id}`).send({
   name: "My DonationItem",
   price: 1000,
   image: "my-donationItem.com",
   status: true,
  });

  expect(res.status).toBe(200);
  expect(res.body.donationItem).toHaveProperty("id");
 });

 it("should return 404 if donationItem not found", async () => {
  const res = await request(app).put(`/donationItem/123456`).send({
   name: "My DonationItem",
   price: 1000,
   image: "my-donationItem.com",
   status: true,
  });
  expect(res.status).toBe(404);
 });

 it("should return 400 if donationItem name is not valid", async () => {
  const res = await request(app).put(`/donationItem/${donationItem.id}`).send({
   name: "",
   price: 1000,
   image: "my-donationItem.com",
   status: true,
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem price is not valid", async () => {
  const res = await request(app).put(`/donationItem/${donationItem.id}`).send({
   name: "My DonationItem",
   price: -1000,
   image: "my-donationItem.com",
   status: true,
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem image is not valid", async () => {
  const res = await request(app).put(`/donationItem/${donationItem.id}`).send({
   name: "My DonationItem",
   price: 1000,
   image: "",
   status: true,
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem status is not valid", async () => {
  const res = await request(app).put(`/donationItem/${donationItem.id}`).send({
   name: "My DonationItem",
   price: 1000,
   image: "my-donationItem.com",
   status: "",
  });

  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem status is not valid", async () => {
  const res = await request(app).put(`/donationItem/${donationItem.id}`).send({
   name: "My DonationItem",
   price: 1000,
   image: "my-donationItem.com",
   status: "true",
  });

  expect(res.status).toBe(400);
 });
 

 afterAll(async () => {
  await prisma.donationItem.deleteMany();
 });
});
