import request from "supertest";
import app from "../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("DonationItem POST /donationItem", () => {
 beforeAll(async () => {
  await prisma.donationItem.deleteMany();
 });
 it("should create donationItem", async () => {
  const res = await request(app).post("/donationItem").send({
   name: "My DonationItem",
   price: 1000,
   image: "my-donationItem.com",
   status: true,
  });

  expect(res.status).toBe(201);
 });

 it("should return 400 if donationItem name is not provided", async () => {
  const res = await request(app).post("/donationItem").send({
   price: 1000,
   image: "my-donationItem.com",
   status: true,
  });

  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem price is not provided", async () => {
  const res = await request(app).post("/donationItem").send({
   name: "My DonationItem",
   image: "my-donationItem.com",
   status: true,
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem image is not provided", async () => {
  const res = await request(app).post("/donationItem").send({
   name: "My DonationItem",
   price: 1000,
   status: true,
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem name is not a string", async () => {
  const res = await request(app).post("/donationItem").send({
   name: 1234,
   price: 1000,
   image: "my-donationItem.com",
   status: true,
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem price is not a number", async () => {
  const res = await request(app).post("/donationItem").send({
   name: "My DonationItem",
   price: "1000ubnk",
   image: "my-donationItem.com",
   status: true,
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem image is not a string", async () => {
  const res = await request(app).post("/donationItem").send({
   name: "My DonationItem",
   price: 1000,
   image: 1234,
   status: true,
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem status is not a boolean", async () => {
  const res = await request(app).post("/donationItem").send({
   name: "My DonationItem",
   price: 1000,
   image: "my-donationItem.com",
   status: "truesad",
  });
  expect(res.status).toBe(400);
 });

 it("should return 400 if donationItem is {}", async () => {
  const res = await request(app).post("/donationItem").send({});
  expect(res.status).toBe(400);
 });

 afterAll(async () => {
  await prisma.donationItem.deleteMany();
 });
});
