import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

type image = {
    url:string,
    default:boolean,
}

export interface iAd{
    idUser: string,
    state: string,
    category: string,
    images:image[],
    createdAt: Date,
    title: string
    price: number,
    priceNegotiable: boolean,
    description: string,
    views: number,
    status: boolean,
    id?:string
}

const modelSchema = new mongoose.Schema<iAd>({
    idUser:{type: String, required:true},
    state:{type: String, required:true},
    category:{type: String, required:true},
    images:{type: [Object]},
    createdAt:{type: Date, required:true},
    title:{type: String, required:true},
    price: {type: Number, required:true},
    priceNegotiable: {type: Boolean, required:true},
    description: {type: String},
    views: {type: Number, required:true},
    status: {type: Boolean, required:true},
});


const Ad = mongoose.model<iAd>('Ad', modelSchema);

export default Ad;