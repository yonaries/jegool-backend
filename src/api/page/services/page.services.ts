import { Page, PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createPage = async (page: Page): Promise<{ id: string }> => {
    try {
        const createdPage = await prisma.page.create({
            data: page,
            select: {
                id: true,
            },
        });
        return createdPage;

    } catch (error) {
        throw error;
    }

}

export const updatePage = async (id: string, page: Page): Promise<{ id: string }> => {
    try {
        const updatedPage = await prisma.page.update({
            where: {
                id: id,
            },
            data: page,
            select: {
                id: true,
            },
        });
        return updatedPage;

    } catch (error) {
        throw error;
    }

}
