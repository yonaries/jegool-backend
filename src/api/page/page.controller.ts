import { handlePrismaError } from '../utils/prismaErrorHandler.util'
import { validatePage } from './page.validate'
import PageServices from './services'
import { Request, Response } from 'express'

export default class PageController {
    static async createPage(req: Request, res: Response) {
        const page = req.body


        try {
            const { error } = validatePage(page)
            if (error) return res.status(400).json({ error: error.message })
            const name = page.name as string
            if (!page.url) {
                const url = `https://jegool.com/${name.replace(/\s+/g, '').toLowerCase()}`
                page.url = url
            }

            const createdPage = await PageServices.createPage(page)
            return res.status(201).json({ page: createdPage })
        } catch (error) {
            return handlePrismaError(res, error, 'Page')
        }
    }

    static async updatePage(req: Request, res: Response) {
        const { id } = req.params;

        if (id.length === 0 || !id) {
            return res.status(400).json({ error: "Page Id Is Required" });
        }

        try {
            const page = req.body
            const { error } = validatePage(page)
            if (error) return res.status(400).json({ error: error.message })

            const updatedPage = await PageServices.updatePage(id, page)
            return res.status(204).json({ page: updatedPage })
        } catch (error) {
            return handlePrismaError(res, error, 'Page')
        }
    }

    static async deletePage(req: Request, res: Response) {
        const { id } = req.params;

        if (id.length === 0 || !id) {
            return res.status(400).json({ error: "Page Id Is Required" });
        }

        try {
            const deletedPage = await PageServices.deletePage(id)
            return res.status(204).json({ page: deletedPage })
        } catch (error) {
            return handlePrismaError(res, error, 'Page')
        }
    }
}