import Ad,{iAd} from '../models/Ad';
import { iUser } from '../models/User';
import mongoose from 'mongoose';
import { UploadedFile } from 'express-fileupload';
import {v4 as uuid} from 'uuid'
import jimp from 'jimp';

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
    const acceptTypes = ['image/jpeg', 'image/jpg', 'image.png'];

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