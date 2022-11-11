import {Request, Response, NextFunction} from 'express';
import User from '../models/User';

const notAuthorized = {status:401, message:'Token not authorized'}

const authToken = async (req: Request, res: Response, next: NextFunction) =>{
    const token = req.body.token || req.query.token;
    console.log('Token', token);
    if(!token) return res.status(401).json({error: 'Token not Authorized'});

    const user = await User.findOne({token});
    if(!user){return res.status(401).json({error: 'Token not authorized'})};
    return next();
}

export default authToken;