import { Post, Prisma, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createPost = async (post: Post): Promise<{ id: string }> => {

    try {
        const { visibleTo, ...rest } = post;
        const createdPost = await prisma.post.create({
            data: {
                ...rest,
                visibleTo: visibleTo as Prisma.JsonArray
            },
            select: {
                id: true,
            },
        });
        return createdPost;

    } catch (error) {
        throw error;
    }
}

export const deletePost = async (id: string): Promise<{ id: string }> => {
    try {
        const deletedPost = await prisma.post.delete({
            where: { id },
            select: {
                id: true,
            }
        });
        return deletedPost;
    } catch (error) {
        throw error;
    }
}

export const updatePost = async (id: string, post: Post): Promise<{ id: string }> => {
    try {
        const { visibleTo, ...rest } = post;
        console.log(visibleTo, rest);
        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                ...rest,
                visibleTo: visibleTo as Prisma.JsonArray
            },
            select: {
                id: true,
            },
        });
        return updatedPost;
    } catch (error) {
        throw error;
    }
}