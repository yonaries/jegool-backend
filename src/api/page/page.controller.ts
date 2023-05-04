import { PrismaErrorHandler } from '../utils/prismaErrorHandler.util'
import { validatePage } from './page.validate'
import PageServices from './services'
import { Request, Response } from 'express'

export default class PageController {
    static async createPage(req: Request, res: Response) {
        const page = req.body

        try {
            const { error } = validatePage(page)
            if (error) return res.status(400).json({ error: error.message })

            const createdPage = await PageServices.createPage(page)
            return res.status(201).json({ page: createdPage })
        } catch (error) {
            return PrismaErrorHandler(res, error, 'Page')
        }
    }
}