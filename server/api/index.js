import { Router } from 'express'

import decay from './decay'
import find from './find'

const router = Router()

// Routes
router.use(decay)
router.use(find)

export default router
