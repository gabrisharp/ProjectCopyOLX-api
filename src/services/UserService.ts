import User, {iUser} from '../models/User';
import State from '../models/State';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcrypt';

const SALT_BCRYPT = 10;

export const createUser = async (data:any) =>{
    const hasUser = await User.findOne({email:data.email});
    if(hasUser) throw new ApiError('Bad Request', 400, [{email:'Email already in use'}]);
    if(!mongoose.Types.ObjectId.isValid(data.state)){
        throw new ApiError('Bad Request', 400, [{state:'State code invalid'}]); 
    }
    const hasState = await State.findById(data.state);
    if(!hasState) throw new ApiError('Bad Request', 400, [{state:'State does not exist'}]);        
    
    data.passwordHash = bcrypt.hashSync(data.password, SALT_BCRYPT );
    const payload = data.name + (Date.now() + Math.random()).toString();
    data.token = bcrypt.hashSync(payload, SALT_BCRYPT);

    const newUser = new User({
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        state: data.state,
        token: data.token,
    });
    await newUser.save();
    return data.token;
}