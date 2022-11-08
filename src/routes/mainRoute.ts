import {Router, Request, Response, NextFunction} from 'express';
import {getStates} from '../controller/UserController';
import {getCategories} from '../controller/AdsController';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction)=>{
    try {
        res.json({pong: true});
    } catch (err) {next(err)}
});

router.get('/states', getStates);
router.get('/categories', getCategories);

export default router;