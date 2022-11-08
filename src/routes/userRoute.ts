import {Router} from 'express';

const router = Router();

router.post('/signin');
router.post('/signup');

router.get('/me');
router.put('/me');

export default router;