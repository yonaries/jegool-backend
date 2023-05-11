import request from "supertest";
import app from "../../../app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createBenefit = async () => {
 const benefit = await prisma.benefit.create({
  data: {
   title: "tetetetetete",
   description: "tetetetetetetetetetetetetetetetetetetet",
   membershipId: "etetetetetet",
  },
 });

 return benefit.id;
};

describe("Benefit /api/benefit", () => {
 beforeAll(async () => {
  await prisma.$connect();
  await prisma.benefit.deleteMany();
 }, 10000);
 test("should update benefit return 204", async () => {
  const id = await createBenefit();

  const res = await request(app).put(`/benefit/${id}`).send({
   title: "fafafaf",
   description: "qwertyuiopqeqeqeqeqeqeasdfghjkl",
   membershipId: "qwqwqwqwwqw",
  });

  expect(res.status).toBe(204);
 }, 10000);
 test("should not update benefit with invalid id return 404", async () => {
  const res = await request(app).put("/benefit/invalid").send({
   title: "fafafaffafafa",
   description: "qwertyuiopqeqeqeqeqeqeasdfghjkl",
   membershipId: "qwqwqwqwwqw",
  });

  expect(res.status).toBe(404);
 }, 10000);

 afterAll(async () => {
  await prisma.benefit.deleteMany();
  await prisma.$disconnect();
 }, 10000);
});
