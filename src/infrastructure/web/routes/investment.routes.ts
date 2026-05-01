import { Router } from 'express'
import { InvestmentController } from '../controllers/InvestmentController'

const router = Router()
const controller = new InvestmentController()

router.post('/', (req, res, next) => controller.create(req, res, next))
router.get('/', (req, res, next) => controller.list(req, res, next))
router.delete('/:asset', (req, res, next) => controller.remove(req, res, next))

export default router