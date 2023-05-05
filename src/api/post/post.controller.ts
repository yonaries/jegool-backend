import { handlePrismaError } from '../utils/prismaErrorHandler.util'
import { Request, Response } from 'express'
import PostServices from './services/index'
import { validatePost } from './post.validate'

export default class PostController {
    static createPost = async (req: Request, res: Response) => {
        try {
            const post = req.body
            const { error } = validatePost(post)
            if (error) return res.status(400).json({ error: error.message })

            const createdPost = await PostServices.createPost(req.body)
            res.status(201).json({ post: createdPost })
        } catch (error) {
            handlePrismaError(res, error, 'Post')
        }
    }
}
