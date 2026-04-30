import { Router } from 'express'
import { InstallmentController } from '../controllers/InstallmentController'

const router = Router()
const controller = new InstallmentController()

router.post('/', (req, res, next) => controller.create(req, res, next))
router.get('/pending', (req, res, next) => controller.listPending(req, res, next))
router.patch('/:id/pay', (req, res, next) => controller.markAsPaid(req, res, next))

export default router