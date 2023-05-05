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
            const url = `https://jegool.com/${name.replace(/\s+/g, '').toLowerCase()}`
            page.url = url

            const createdPage = await PageServices.createPage(page)
            return res.status(201).json({ page: createdPage })
        } catch (error) {
            return handlePrismaError(res, error, 'Page')
        }
    }
}