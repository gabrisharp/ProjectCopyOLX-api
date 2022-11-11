import {Router} from 'express';
import * as AdController from '../controller/AdsController';
import authMiddleware from '../middlewares/authMiddleware';
import * as adValidator from '../middlewares/validators/adValidator';

const router = Router();

router.post('/add',authMiddleware, adValidator.add, AdController.addAction);
router.get('/list', AdController.getList);
router.get('/item', AdController.getItem);
router.post('/ad/:id', AdController.editAction);

export default router;