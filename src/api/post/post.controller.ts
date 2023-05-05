import { handlePrismaError } from '../utils/prismaErrorHandler.util'
import { Request, Response } from 'express'
import PostServices from './services/index'
import { validatePost } from './post.validate'
import { Post } from '@prisma/client'
import PageServices from '../page/services'

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

    static deletePost = async (req: Request, res: Response) => {
        const { id } = req.params
        const { pageId } = req.body
        const { uid } = req.body.user

        try {
            const page = await PageServices.getPageById(pageId)
            if (!page) return res.status(404).json({ error: 'Page not found' })
            if (!page.id || page.ownerId !== uid) return res.status(403).json({ error: 'Unauthorized request' })

            //todo: check if post is in page before deleting by id

            const deletedPost = await PostServices.deletePost(id)
            return res.status(204).json({ post: deletedPost })
        } catch (error) {
            return handlePrismaError(res, error, 'Post')
        }
    }
}
