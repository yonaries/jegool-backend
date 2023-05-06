import { handlePrismaError } from '../utils/prismaErrorHandler.util'
import { Request, Response } from 'express'
import PostServices from './services/index'
import { validatePost } from './post.validate'
import { Post } from '@prisma/client'

export default class PostController {
    static createPost = async (req: Request, res: Response) => {
        const post = req.body

        try {
            const { error } = validatePost(post)
            if (error) return res.status(400).json({ error: error.message })

            const createdPost = await PostServices.createPost(post)
            return res.status(201).json({ post: createdPost })
        } catch (error) {
            return handlePrismaError(res, error, 'Post')
        }
    }
}
