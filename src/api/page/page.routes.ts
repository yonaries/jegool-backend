import express from 'express'
import PageController from './page.controller'

const router = express.Router()

router.post('/', PageController.createPage)

export default router
