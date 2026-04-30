import { Router } from 'express'
import { TransactionController } from '../controllers/TransactionController'

const router = Router()
const controller = new TransactionController()

router.post('/', (req, res, next) => controller.create(req, res, next))
router.get('/', (req, res, next) => controller.list(req, res, next))

export default router
