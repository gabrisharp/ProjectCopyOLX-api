import {Request, Response, NextFunction} from 'express';
import {validationResult, matchedData} from 'express-validator';
import * as UserService from '../services/UserService';

export const login = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error:'fields not valid', errors: errors.array()});
        };
        const {email, password} = matchedData(req);

        const user = await UserService.findByEmail(email);
        if(!user) return res.status(400).json({error:'Wrong credentials'});

        if(await UserService.matchPassword(password, user.passwordHash)){
            return res.status(400).json({error:'Wrong credentials'});
        };
        //token
        user.token = await UserService.createToken(user.name);
        await user.save();

        return res.json({status:true, token: user.token, email: user.email});
    } catch (err) { next(err)}
}

export const register = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        //Fields Erros validator
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error: 'Fields Invalid', erorrs: errors.array()});
        };
        //Get the data from validator
        const data = matchedData(req);
        const user = await UserService.createUser(data);
        return res.json({status: true, token: user.token});
    } catch (err) {next(err)}
}