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

  static async getMembershipById(req: Request, res: Response) {
    const { id } = req.params;

    if (id.length === 0 || !id)
      return res.status(400).json({ error: "Membership Id Is Required" });

    try {
      const membership = await MembershipService.getMembershipById(id);
      if (!membership)
        return res.status(404).json({ error: "Membership not found" });
      return res.status(200).json({ membership });
    } catch (error) {
      handlePrismaError(res, error, "Membership");
    }
  }

  static async updateUserById(req: Request, res: Response) {
    const { id } = req.params;
    const membership = req.body;

    if (id.length === 0 || !id)
      return res.status(400).json({ error: "Membership Id Is Required" });

    try {
      const { error } = validateMembership(membership);
      if (error) return res.status(400).json({ error: error.message });

      const updatedMembership = await MembershipService.updateMembershipById(
        id,
        membership
      );

      return res.status(200).json({ membership: updatedMembership });
    } catch (error) {
      handlePrismaError(res, error, "Membership");
    }
  }
}
