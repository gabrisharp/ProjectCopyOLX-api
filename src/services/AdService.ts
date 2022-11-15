import { UploadedFile } from 'express-fileupload';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ad,{iAd} from '../models/Ad';
import { iUser } from '../models/User';
import {v4 as uuid} from 'uuid'
import jimp from 'jimp';
import Category from '../models/Category';
import ApiError from '../utils/ApiError';
import * as UserService from '../services/UserService';

dotenv.config();
const DEFAULT_IMAGE = `${process.env.HOST}/media/default.jpg`;

export type filter={
    title?: {'$regex': string, '$options': string},
    category?: string ,
    state?: string,
    idUser?:string
};

const addImage = async (buffer:Buffer) =>{
    let newName = `${uuid()}.jpg`;
    let tmpImg = await jimp.read(buffer);
    tmpImg.cover(500, 500) //Proporcional 500x500
        .quality(80)        
        .write(`./public/media/${newName}.jpg`);
    return newName;
}


export const listByUser = async (id:mongoose.Types.ObjectId)=>{
    return await Ad.find({idUser:id});
}

export const createAdd = async (user:iUser, data:any)=>{
    if(data.catg){
        const catg = await Category.findById(data.catg);
        if(!catg) throw new ApiError('Not Found Category', 404, [{catg: 'Category Not found'}]);
    }
    
    
    const newAd = new Ad();
    newAd.status = true,
    newAd.idUser = user.id as string,
    newAd.state = user.state,
    newAd.createdAt = new Date();
    newAd.title = data.title,
    newAd.category = data.catg,
    newAd.price = data.price || 0,
    newAd.priceNegotiable = (data.priceneg == 'true') ? true: false,
    newAd.description = data.desc;
    newAd.views = 0;

    return await newAd.save()
}   

export const addImages = async (ad:iAd, img:UploadedFile | UploadedFile[]) =>{
    const acceptTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    
    if(Array.isArray(img)){ //img is a array?
        for(let i in img){
            if(acceptTypes.includes(img[i].mimetype)){
                let url = await addImage(img[i].data);
                ad.images.push({
                url,
                default:false,
                });
            }
        }
    }else{  //one image
        if(acceptTypes.includes(img.mimetype)){
            
            let url = await addImage(img.data);
            ad.images.push({
                url,
                default:false,
            });
        }
    }
    if(ad.images.length >0) ad.images[0].default = true;
}

export const getAds = async (filter:filter, opt?:{ sort:string, offset:number, limit:number }) =>{
 
    const totalAds = await Ad.find({...filter, status: true}).exec();
    const total = totalAds.length;
    let allAds:(mongoose.Document<unknown, any, iAd> & iAd & {
        _id: mongoose.Types.ObjectId;
    })[];
    
    if(opt){
        allAds = await Ad.find({...filter, status:true })
            .sort({ dateCreated: (opt.sort=='desc'? -1: 1)})
            .skip(opt.offset)
            .limit(opt.limit)
            .exec();
    }else{ allAds = await Ad.find({... filter, status: true})}
    
    let list: any[] =[];
    allAds.forEach( ad =>{
        let imageUrl:string;
        let defaultImg = ad.images.find( e => e.default);
        if(defaultImg){
            imageUrl = `${process.env.HOST}/media/${defaultImg.url}`;
        }else{
            imageUrl = DEFAULT_IMAGE;
        }
        list.push({
            id:ad._id.toString(),
            title: ad.title,
            price: ad.price,
            priceNegotiable: ad.priceNegotiable,
            image: imageUrl,
        })
    });
    return {list, total};
}

export const getById = async (id:string) =>{
    const ad = await Ad.findById(id);
    return ad;
}

export const increaseView = async (ad:iAd) =>{
    ad.views++;
}

type adUpdates = {
    title?: string,
    category?: string,
    price?: number,
    priceNegotiable?: boolean,
    description?: string,
    status?: boolean,
}

export const editAd = async (id:string, token:string, updates:adUpdates) =>{
    if(updates.category){
        const catg = await Category.findById(updates.category);
        if(!catg) throw new ApiError('Not Found Category', 404, [{catg: 'Category Not found'}]);
    }
    const ad = await getById(id);
    const user = await UserService.findByToken(token);
    
    if(user?._id.toString() !== ad?.idUser) throw new ApiError('You cannot edit other users ads', 400);

    await Ad.findByIdAndUpdate(id, {$set: updates});
}