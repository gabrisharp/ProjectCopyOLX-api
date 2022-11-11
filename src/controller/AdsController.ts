import {Request, Response, NextFunction} from 'express';
import {validationResult, matchedData} from 'express-validator';
import {v4 as uuid} from 'uuid';
import jimp from 'jimp';

import * as UserService from '../services/UserService'
import * as AdService from '../services/AdService';
import Category from '../models/Category';
import { UploadedFile } from 'express-fileupload';

const addImage = async (buffer:Buffer) =>{
    let newName = `${uuid()}.jpg`;
    let tmpImg = await jimp.read(buffer);
    tmpImg.cover(500, 500) //Proporcional 500x500
        .quality(80)        
        .write(`./public/media/${newName}.jpg`);
    return newName;
}

export const getCategories = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const catgs = await Category.find();
        let categories:object[] = [];

        catgs.forEach( catg =>{
            categories.push({
                ... catg.toObject(),
                img: `${process.env.HOST}/assets/images/${catg.slug}.png`
            });
        })
        res.json({categories});
    } catch (err) { next(err)}
}

export const addAction = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({error: 'Invalid fields', erorrs: errors.array()});
        }
        const data = matchedData(req);
        const user = await UserService.findByToken(data.token);
        if(!user) return res.status(401).json({error: 'Invalid token'});
        
        const newAd = await AdService.createAdd(user, data);

        if(req.files && req.files.img){
            await AdService.addImages(newAd, req.files.img);
            await newAd.save();
        }
        const id = newAd._id;
        return res.json({data, id});
    } catch (err) { next(err)}
}

export const getList = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        
    } catch (err) { next(err)}
}

export const getItem = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        
    } catch (err) { next(err)}
}

export const editAction = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        
    } catch (err) { next(err)}
}