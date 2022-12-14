import {Router} from 'express';
import * as AdController from '../controller/AdsController';
import authMiddleware from '../middlewares/authMiddleware';
import * as adValidator from '../middlewares/validators/adValidator';

const router = Router();

router.post('/add',authMiddleware, adValidator.add, AdController.addAction);
router.get('/list', authMiddleware, AdController.getList);
router.get('/item', authMiddleware, adValidator.getItem ,AdController.getItem);
router.post('/:id', authMiddleware, adValidator.edit, AdController.editAction);
router.delete('/imgdelete/:id', authMiddleware, adValidator.edit, AdController.deleteImg);

export default router;