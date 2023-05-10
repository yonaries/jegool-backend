import { PrismaError } from "../../errors/prisma.error";
import { Benefit } from "@prisma/client";
import { Request, Response } from "express";
import { validateCreateBenefit } from "./benefit.validate";
import BenefitService from "./services";

export default class BenefitController {
	static createBenefit = async (req: Request, res: Response) => {
		const benefit = req.body;
		try {
			const { error } = validateCreateBenefit(benefit);
			if (error) return res.status(400).json({ error: error.message });

			const newBenefit = await BenefitService.createBenefit(benefit);
			res.status(201).json({ benefit: newBenefit });
		} catch (error) {
			return PrismaError(res, error);
		}
	};
}
