import { PrismaError } from "../../errors/prisma.error";
import { validatePage } from "./page.validate";
import PageServices from "./services";
import { Request, Response } from "express";

export default class PageController {
 static async createPage(req: Request, res: Response) {
  const page = req.body;

  try {
   const { error } = validatePage(page);
   if (error) return res.status(400).json({ error: error.message });
   const name = page.name as string;
   if (!page.url) {
    const url = `https://jegool.com/${name.replace(/\s+/g, "").toLowerCase()}`;
    page.url = url;
   }

   const createdPage = await PageServices.createPage(page);
   return res.status(201).json({ page: createdPage });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async updatePage(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) {
   return res.status(400).json({ error: "Page Id Is Required" });
  }

  try {
   const page = req.body;
   const { error } = validatePage(page);
   if (error) return res.status(400).json({ error: error.message });

   const updatedPage = await PageServices.updatePage(id, page);
   return res.status(204).json({ page: updatedPage });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async deletePage(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) {
   return res.status(400).json({ error: "Page Id Is Required" });
  }

  try {
   const deletedPage = await PageServices.deletePage(id);
   return res.status(204).json({ page: deletedPage });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async getPageById(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) {
   return res.status(400).json({ error: "Page Id Is Required" });
  }

  try {
   const page = await PageServices.getPageById(id);
   return res.status(200).json({ page: page });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async getAllPages(req: Request, res: Response) {
  try {
   const pages = await PageServices.getAllPages();
   return res.status(200).json({ pages: pages });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async getPageMemberShips(req: Request, res: Response) {
  try {
   const { id } = req.params;

   if (!id || id.length === 0) return res.status(400).json({ error: "Page Id Is Required" });

   const memberships = await PageServices.getPageMemberShips(id);
   return res.status(200).json({ memberships: memberships });
  } catch (error) {
   return PrismaError(res, error);
  }
 }
}
