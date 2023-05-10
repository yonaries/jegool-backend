import { PrismaError } from "../../errors/prisma.error";
import { Benefit } from "@prisma/client";
import { Request, Response } from "express";
import { validateCreateBenefit } from "./benefit.validate";
import BenefitService from "./services";
import MembershipService from "../membership/services";

export default class BenefitController {
	static createBenefit = async (req: Request, res: Response) => {
		const benefit = req.body;
		try {
			const { error } = validateCreateBenefit(benefit);
			if (error)
				return res.status(400).json({ error: { message: error.message } });

			const newBenefit = await BenefitService.createBenefit(benefit);
			res.status(201).json({ benefit: newBenefit });
		} catch (error) {
			return PrismaError(res, error);
		}
	};

	static getBenefitById = async (req: Request, res: Response) => {
		try {
			const { id } = req.params;

			if (id === "all") {
				const benefits = await BenefitService.getBenefits();
				return res.status(200).json({ benefits: benefits });
			}

			const benefit = await BenefitService.getBenefitById(id);
			return res.status(200).json({ benefit: benefit });
		} catch (error) {
			return PrismaError(res, error);
		}
	};

	static getBenefitsByQuery = async (req: Request, res: Response) => {
		try {
			const { membershipId } = req.query;
			console.log("id: ", membershipId);
			if (membershipId) {
				const id = membershipId as string;

				await MembershipService.getMembershipById(id);
				const benefits = await BenefitService.getBenefitsByQuery(id);
				return res.status(200).json({ benefits: benefits });
			} else {
				return res.status(400).json({ error: { message: "invalid query" } });
			}
		} catch (error) {
			return PrismaError(res, error);
		}
	};
}
