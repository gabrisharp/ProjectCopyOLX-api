import {Request, Response, NextFunction} from 'express';
import {validationResult, matchedData} from 'express-validator';
import ApiError from '../utils/ApiError';
import * as UserService from '../services/UserService';
import {iUser} from '../models/User';

export const login = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        
    } catch (err) { next(err)}
}

export const register = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        //Fields Erros validator
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            throw new ApiError('Fields not valid', 400, errors.array());
        };
        //Get the data from validator
        const data = matchedData(req);
        const token = await UserService.createUser(data);
        return res.json({status: true, token});
    } catch (err) {console.log('I catch a error');next(err)}
}