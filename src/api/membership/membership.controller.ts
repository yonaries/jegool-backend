import { Request, Response } from "express";
import MembershipService from "./services";
import { validateMembership } from "./membership.validate";
import { handlePrismaError } from "../utils/prismaErrorHandler.util";

export default class MembershipController {
  static async createMembership(req: Request, res: Response) {
    const membership = req.body;
    try {
      const { error } = validateMembership(membership);
      if (error) return res.status(400).json({ error: error.message });

      const newMembership = await MembershipService.createMembership(
        membership
      );
      res.status(201).json(newMembership);
    } catch (error) {
      handlePrismaError(res, error, "Membership");
    }
  }
}
