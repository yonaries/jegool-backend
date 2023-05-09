import { PrismaClient } from "@prisma/client";
import { Benefit } from "@prisma/client";

const prisma = new PrismaClient();

export const createBenefit = async (benefit: Benefit) => {
	try {
		const createdBenefit = await prisma.benefit.create({
			data: benefit,
		});
		return createdBenefit;
	} catch (error) {
		throw error;
	}
};
