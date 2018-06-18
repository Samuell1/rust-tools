import { Router } from 'express'

import decay from './decay'
import findLoot from './findLoot'

const router = Router()

// Routes
router.use(decay)
router.use(findLoot)

export default router
