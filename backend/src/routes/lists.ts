import { Router } from 'express';
import { listsController } from '../controllers/listsController';

const router = Router();

router.get('/', listsController.getAll);
router.get('/:id', listsController.getById);
router.post('/', listsController.create);
router.put('/:id', listsController.update);
router.delete('/:id', listsController.remove);

export default router;