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

export const getBenefitById = async (id: string) => {
	console.log("id:", id);
	try {
		const benefit = prisma.benefit.findUniqueOrThrow({
			where: {
				id: id,
			},
			select: {
				id: true,
			},
		});
		return benefit;
	} catch (error) {
		throw error;
	}
};

export const getBenefits = async () => {
	try {
		const benefits = await prisma.benefit.findMany();
		return benefits;
	} catch (error) {
		throw error;
	}
};
