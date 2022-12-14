import {Request, Response, NextFunction} from 'express';
import {validationResult, matchedData} from 'express-validator';
import { unlink } from 'fs';
import dotenv from 'dotenv';

import * as UserService from '../services/UserService'
import * as AdService from '../services/AdService';
import Category from '../models/Category';
import State from '../models/State';

dotenv.config();

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
            console.log('images', newAd.images);
            await newAd.save();
        }
        const id = newAd._id;
        return res.json({data, id});
    } catch (err) { next(err)}
}

export const getList = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        let { 
            sort = 'asc', 
            offset = 0,  //offset - paginação
            limit = 8, 
            q, 
            catg, 
            state } = req.query;  
        let filter:AdService.filter = {};

        if(q){ //Allow search like %something% in sql 
            filter.title = {'$regex': q as string, '$options': 'i'};  //ignore case sensitive
        }
        if(catg){
            const c = await Category.findOne({ slug: catg});
            if(c) filter.category = c._id.toString();
        }
        if(state){
            const st = await State.findOne({ name: (state as string).toUpperCase});
            if(st) filter.state = st._id.toString();
        }
        const opt ={
            sort: sort.toString(),
            offset: parseInt(offset as string),
            limit: parseInt(limit as string)
        }
        const result = await AdService.getAds(filter, opt);
        return res.json(result);
    } catch (err) { next(err)}
}

export const getItem = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        let other: string| boolean = false;
        let id = req.query.id as string;
        if(req.query.other) other = req.query.other as string;
        other = other == 'true'? true : false;

        const ad = await AdService.getById(id);
        if(!ad) return res.status(404).json({error: 'Item not found'});
        AdService.increaseView(ad);
        await ad.save();

        const user = await UserService.findById(ad.idUser);
        const state = await State.findById(ad.state);
        const catg = await Category.findById(ad.category);
        
        let tempAd = (({id, title, price, priceNegotiable, description, views, createdAt}) => 
        ({id, title, price, priceNegotiable, description, views, createdAt}))(ad);
        

        const result = {
            ...tempAd,
            images: ad.images.map( img => `${process.env.HOST}/media/${img.url}`),
            category: catg?.toObject(),
            userInfo: {name: user?.name, email: user?.email},
            stateName: state?.name
        }
        //Other Results
        let others:any[] =[];
        if(other){
            others = (await AdService.getAds({idUser:user?._id.toString()})).list;
            others = others.filter( i => i.id !== ad.id);
        }
        return res.json({result, others});

    } catch (err) { next(err)}
}

export const editAction = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){ 
            return res.status(400).json({error: 'Invalid fields', errors:errors.array()});
        }
        let {id, title, token, status, price, priceneg, catg, desc} = matchedData(req);

        const ad = await AdService.getById(id);
        if(!ad) return res.status(404).json({error: 'Ad not found'})
        
        //Adding images
        if(req.files && req.files.img){
            await AdService.addImages(ad, req.files.img);
            console.log('images', ad.images);
            await ad.save();
        }

        //Editing ads
        await AdService.editAd(id, token, {
            title, 
            status, 
            category:catg, 
            price, 
            priceNegotiable: priceneg, 
            description: desc});

        return res.json(ad);

    } catch (err) { next(err)}
}

export const deleteImg = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){ 
            return res.status(400).json({error: 'Invalid fields', errors:errors.array()});
        }
        let {id, token} = matchedData(req);

        if(!Array.isArray(req.body.url)){
            return res.status(400).json({error:'Missing Url of images to delete'});
        } 
        const url = req.body.url as string[];
        const actualImgs = await AdService.deleteImgs(id, token, url);
        
        return res.json(actualImgs);
    } catch (err) { next(err)}
}