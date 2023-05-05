import { handlePrismaError } from '../utils/prismaErrorHandler.util'
import { Request, Response } from 'express'
import PostServices from './services/index'

export default class PostController {
    static createPost = async (req: Request, res: Response) => {
        try {
            const post = await PostServices.createPost(req.body)
            res.status(201).json(post)
        } catch (error) {
            handlePrismaError(res, error, 'Post')
        }
    }
}
