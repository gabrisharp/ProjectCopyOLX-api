import {Request, Response, NextFunction} from 'express';
import State from '../models/State';
import User, {iUser} from '../models/User';

export const getStates = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const states = await State.find();
        return res.json({states});
    } catch (err) { next(err)}
}

export const info = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        
    } catch (err) { next(err)}
}

export const editInfo = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        
    } catch (err) { next(err)}
}