import User, {iUser} from '../models/User';
import State from '../models/State';
import mongoose from 'mongoose';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcrypt';

const SALT_BCRYPT = 10;

export const createUser = async (data:any) =>{
    const hasUser = await findByEmail(data.email)
    if(hasUser){
        throw new ApiError('Bad Request', 400, [{email:'Email already in use'}]);
    } 
    if(!mongoose.Types.ObjectId.isValid(data.state)){
        throw new ApiError('Bad Request', 400, [{state:'State code invalid'}]); 
    }
    const hasState = await State.findById(data.state);
    
    if(!hasState) throw new ApiError('Bad Request', 400, [{state:'State does not exist'}]);        
    data.passwordHash = bcrypt.hashSync(data.password, SALT_BCRYPT );
    
    data.token = await createToken(data.name);

    const newUser = new User({
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        state: data.state,
        token: data.token,
    });
    await newUser.save();
    return newUser;
}

export const findByEmail = async (email:string)=>{
    const user = await User.findOne({email});
    return user;
}

export const matchPassword = async (password:string, passwordHash:string)=>{
    return await bcrypt.compare(password, passwordHash);
}

export const createToken = async (name:string)=>{
    const payload = name + (Date.now() + Math.random()).toString();
    const token = bcrypt.hashSync(payload, SALT_BCRYPT);
    return token;
}