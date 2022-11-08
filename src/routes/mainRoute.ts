import {Router, Request, Response, NextFunction} from 'express';

const router = Router();

router.get('/ping', (req: Request, res: Response, next: NextFunction)=>{
    try {
        res.json({pong: true});
    } catch (err) {next(err)}
});

export default router;