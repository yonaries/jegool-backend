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