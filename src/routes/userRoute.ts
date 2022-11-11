import {Router} from 'express';
import * as authValidator from '../middlewares/validators/AuthValidator';
import * as authController from '../controller/AuthController';
import * as userController from '../controller/UserController';
import * as userValidator from '../middlewares/validators/userValidator';
import authMiddleware from '../middlewares/authMiddleware';

const router = Router();

router.post('/signin', authValidator.login, authController.login);
router.post('/signup', authValidator.register, authController.register);

router.get('/me', authMiddleware, userController.info);
router.put('/me',userValidator.editInfo, authMiddleware, userController.editInfo);


export default router;