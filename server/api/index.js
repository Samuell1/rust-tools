import { Router } from 'express'

import decay from './decay'

const router = Router()

// Routes
router.use(decay)

export default router
