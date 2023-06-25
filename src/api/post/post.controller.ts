import { PrismaError } from "../../errors/prisma.error";
import { Request, Response } from "express";
import PostServices from "./services/index";
import { validatePost, validatePostFilter } from "./post.validate";
import { Post, PrismaClient } from "@prisma/client";
import PageServices from "../page/services";
import { getPostsByMembershipId } from "./services/post.services";

export default class PostController {
 protected static prisma = new PrismaClient();

 static createPost = async (req: Request, res: Response) => {
  const post = req.body;

  try {
   const page = await PageServices.getPageById(post.pageId);
   if (!page) return res.status(404).json({ error: "Page not found" });

   console.log("Post :: ", post);
   const { error } = validatePost(post);
   if (error) return res.status(400).json({ error: error.message });
   const attachment = post.attachment;
   delete post["attachment"];
   console.log(post);
   console.log(attachment);
   const createdPost =
    attachment.length > 0 ? await PostServices.createPost(post, attachment) : await PostServices.createPost(post);
   return res.status(201).json({ post: createdPost });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id.length === 0 || !id) {
   return res.status(400).json({ error: "Post Id Is Required" });
  }

  try {
   const deletedPost = await PostServices.deletePost(id);
   return res.status(204).json({ post: deletedPost });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, ...post } = req.body;

  try {
   const page = await PageServices.getPageById(post.pageId);
   if (page?.ownerId !== userId) return res.status(403).json({ error: "Unauthorized request" });

   //todo: Replace this with service to check if post is in page before updating post
   const postInPage = await PostController.prisma.post.findFirst({
    where: {
     id,
     pageId: post.pageId,
    },
   });
   if (!postInPage) return res.status(404).json({ error: "Post not found" });

   const { error } = validatePost(post);
   if (error) return res.status(400).json({ error: error.message });

   const updatedPost = await PostServices.updatePost(id, post);
   return res.status(204).json({ post: updatedPost });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (id.length === 0 || !id) {
   return res.status(400).json({ error: "Post Id Is Required" });
  }

  try {
   const post = await PostServices.getPostById(id);
   return res.status(200).json({ posts: post });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static getPostsByPageId = async (req: Request, res: Response) => {
  const { pageId } = req.query;

  try {
   if (!pageId) return res.status(400).json({ error: "Page Id is required" });

   const posts = await PostServices.getPostsByPageId(pageId as string);
   if (!posts) return res.status(404).json({ error: "Posts not found" });

   return res.status(200).json({ posts: posts });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static getAllPosts = async (req: Request, res: Response) => {
  try {
   const posts = await PostServices.getAllPosts();
   return res.status(200).json({ posts: posts });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static getPostsFilter = async (req: Request, res: Response) => {
  const conditions = req.body;
  console.log("controller:", conditions);

  try {
   const { error } = validatePostFilter(req.body);
   if (error) return res.status(400).json({ error: error.message });

   const posts = await PostServices.getPostsFilter(conditions);
   return res.status(200).json({ posts: posts });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static getUserFeedPost = async (req: Request, res: Response) => {
  const id = req.body.user.uid;

  try {
   const posts = await PostServices.getUserFeedPosts(id);
   return res.status(200).json({ posts: posts });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static getPostsByMembershipId = async (req: Request, res: Response) => {
  const { id } = req.query;

  try {
   const posts = await getPostsByMembershipId(id as string);
   return res.status(200).json({ posts: posts });
  } catch (error) {
   return PrismaError(res, error);
  }
 };

 static getSubscribedPosts = async (req: Request, res: Response) => {
  const { id } = req.body;
  const userId = req.body.user.uid;

  try {
   const posts = await PostServices.getSubscribedPosts(userId, id);
   return res.status(200).json({ posts: posts });
  } catch (error) {
   return PrismaError(res, error);
  }
 };
}
