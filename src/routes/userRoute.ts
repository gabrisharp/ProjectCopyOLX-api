import {Router} from 'express';
import * as authValidator from '../middlewares/validators/AuthValidator';
import * as authController from '../controller/AuthController';
import * as errorMiddleware from '../middlewares/errorHandler';

const router = Router();

router.post('/signin', authValidator.login, authController.login);
router.post('/signup', authValidator.register, authController.register);

router.get('/me');
router.put('/me');


export default router;