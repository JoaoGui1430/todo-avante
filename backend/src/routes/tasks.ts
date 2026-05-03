import { Router } from 'express';
import { tasksController } from '../controllers/tasksController';

const router = Router();

router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getById);
router.post('/', tasksController.create);
router.put('/:id', tasksController.update);
router.delete('/:id', tasksController.remove);

export default router;