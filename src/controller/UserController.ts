import {Request, Response, NextFunction} from 'express';
import {validationResult, matchedData} from 'express-validator';
import * as UserService from '../services/UserService';
import * as AdService from '../services/AdService';
import { iAd } from '../models/Ad';
import State from '../models/State';
import Category, { iCategory } from '../models/Category'

export const getStates = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const states = await State.find();
        return res.json({states});
    } catch (err) { next(err)}
}

export const info = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        let {token} = req.query;
        const user = await UserService.findByToken(token as string);
        if(!user) return res.status(401).json({error:'Invalid token'});
        const state = await State.findById(user.state);
        const ads = await AdService.listByUser(user._id);

        let adsList:iAd[]= [];
        for(let i in ads){
            const catg = await Category.findById(ads[i].category) as iCategory;
            adsList[i] = ads[i];
            adsList[i].category = catg.slug;
        }
        res.json({
            name: user.name,
            email: user.email,
            state: state?.name,
            ads: adsList
        })
    } catch (err) { next(err)}
}

export const editInfo = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error:'Fields invalid', errors: errors.array()});
        }
        const data = matchedData(req);
        const user = UserService.findByToken(data.token);
        if(!user) return res.status(401).json({error:'Invalid token'});
        let updates = {...data}; //what have to be edited
        delete updates.token;
        await UserService.updateUser(data.token, updates);
        return res.json({status:true, updates:Object.keys(updates)});

    } catch (err) { next(err)}
}