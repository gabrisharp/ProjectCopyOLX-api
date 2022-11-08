import {Router} from 'express';
import * as AdController from '../controller/AdsController';

const router = Router();

router.post('/add', AdController.addAction);
router.get('/list', AdController.getList);
router.get('/item', AdController.getItem);
router.post('/ad/:id', AdController.editAction);

export default router;