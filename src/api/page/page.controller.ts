import { searchPages } from "./services/page.services";
import { User } from "@prisma/client";
import { ContentType, PostStatus } from ".prisma/client";
import { PrismaError } from "../../errors/prisma.error";
import { validatePage } from "./page.validate";
import PageServices from "./services";
import { Request, Response } from "express";
import UserService from "../user/services";
import profileImagePlaceholder from "@/utils/RandomProfileImageGenerator";

export default class PageController {
 static async createPage(req: Request, res: Response) {
  const page = req.body;

  try {
   const { error } = validatePage(page);
   if (error) return res.status(400).json({ error: error.message });
   const name = page.name as string;
   if (!page.url) {
    const url = `https://jegool.vercel.app/account/${name.replace(/\s+/g, "").toLowerCase()}`;
    page.url = url;
   }
   // if (!page.profileImage) {
   //  page.profileImage = await profileImagePlaceholder();
   // }

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
 static async getPageUserById(req: Request, res: Response) {
  const { id } = req.params;

  if (id.length === 0 || !id) {
   return res.status(400).json({ error: "User Id Is Required" });
  }

  try {
   await UserService.getUserById(id);
   const page = await PageServices.getPageByUserId(id);
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

 static async getPagePosts(req: Request, res: Response) {
  try {
   const { id } = req.params;
   const { type, visibleTo, status } = req.query;

   if (!id || id.length === 0) return res.status(400).json({ error: "Page Id Is Required" });

   //    Validating the query parameters if there are any
   const typeTypes = Object.keys(ContentType);
   const statusTypes = Object.keys(PostStatus);

   if (type && typeTypes.indexOf(String(type).toUpperCase()) < 0)
    return res.status(400).json({ error: "Invalid Type on query parameter" });
   if (status && statusTypes.indexOf(String(status).toUpperCase()) < 0)
    return res.status(400).json({ error: "Invalid Status on query parameter" });
   if (visibleTo) {
    const memberships = (await PageServices.getPageMemberShips(id)).map((membership) => membership.id);
    if (memberships.indexOf(String(visibleTo)) < 0) {
     return res.status(400).json({ error: "There is no membership with that id" });
    }
   }

   const queryParams = {
    status: status ? (String(status).toUpperCase() as PostStatus) : undefined,
    type: type ? (String(type).toUpperCase() as ContentType) : undefined,
    visibleTo: visibleTo ? (String(visibleTo) as string) : undefined,
   };

   const posts = req.query ? await PageServices.getPagePosts(id, queryParams) : await PageServices.getPagePosts(id);
   return res.status(200).json({ posts: posts });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async getPageProjects(req: Request, res: Response) {
  const { id } = req.params;
  const { visibleTo, status } = req.query;

  if (!id || id.length === 0) return res.status(400).json({ error: "Page Id Is Required" });

  //    Validating the query parameters if there are any
  const statusTypes = Object.keys(PostStatus);

  try {
   if (status && statusTypes.indexOf(String(status).toUpperCase()) < 0)
    return res.status(400).json({ error: "Invalid Status on query parameter" });
   if (visibleTo) {
    const memberships = (await PageServices.getPageMemberShips(id)).map((membership) => membership.id);
    if (memberships.indexOf(String(visibleTo)) < 0) {
     return res.status(400).json({ error: "There is no membership with that id" });
    }
   }

   const queryParams = {
    status: status ? (String(status).toUpperCase() as PostStatus) : undefined,
    visibleTo: visibleTo ? (String(visibleTo) as string) : undefined,
   };

   const projects = req.query
    ? await PageServices.getPageProjects(id, queryParams)
    : await PageServices.getPageProjects(id);
   return res.status(200).json({ projects: projects });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async getPageGoals(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || id.length === 0) return res.status(400).json({ error: "Page Id Is Required" });

  try {
   const goals = await PageServices.getPageGoals(id);
   if (!goals) return res.status(404).json({ error: "Page not found" });
   return res.status(200).json({ goals });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async getPageSocialLinks(req: Request, res: Response) {
  const { id } = req.params;

  if (!id || id.length === 0) return res.status(400).json({ error: "Page Id Is Required" });

  try {
   const socialLinks = await PageServices.getPageSocialLinks(id);
   if (!socialLinks) return res.status(404).json({ error: "Page not found" });
   return res.status(200).json({ socialLinks });
  } catch (error) {
   return PrismaError(res, error);
  }
 }

 static async searchPages(req: Request, res: Response) {
  const { query } = req.params;
  if (!query || query.length === 0) return res.status(400).json({ error: "Query is required" });
  try {
   const pages = await PageServices.searchPages(query as string);
   return res.status(200).json({ pages });
  } catch (error) {
   return PrismaError(res, error);
  }
 }
}
