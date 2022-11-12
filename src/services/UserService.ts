import User, {iUser} from '../models/User';
import State from '../models/State';
import ApiError from '../utils/ApiError';
import bcrypt from 'bcrypt';

const SALT_BCRYPT = 10;

interface updates {
    name?:string,
    email?:string,
    password?:string,
    state?:string,
}

interface setUpdates extends updates{
    passwordHash?:string
}

export const createUser = async (data:any) =>{
    const hasUser = await findByEmail(data.email)
    if(hasUser){
        throw new ApiError('Invalid Field', 400, [{email:'Email already in use'}]);
    } 

    const hasState = await State.findById(data.state);
    if(!hasState) throw new ApiError('Invalid Field', 400, [{state:'State does not exist'}]);
            
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

export const updateUser = async(token:string, updates:updates) =>{
    const myUpdate = {... updates as setUpdates};
    if(myUpdate.email){
        const hasEmail = await findByEmail(myUpdate.email);
        if(hasEmail) throw new ApiError('Invalid Field', 400, [{email: 'Email already in use'}]);
    }
    if(myUpdate.state){
        const hasState = await State.findById(myUpdate.state);
        if(!hasState) throw new ApiError('Invalid Field', 400, [{state:'State does not exist'}]);
    }
    if(myUpdate.password){
        myUpdate.passwordHash = bcrypt.hashSync(myUpdate.password, SALT_BCRYPT);
    }
    await User.findOneAndUpdate({token}, {$set: myUpdate});
}

export const findByEmail = async (email:string)=>{
    const user = await User.findOne({email});
    return user;
}

export const findByToken = async (token:string) =>{
    return await User.findOne({token});
}

export const findById = async (id:string) => {
    return await User.findById(id);
}

export const matchPassword = async (password:string, passwordHash:string)=>{
    return await bcrypt.compare(password, passwordHash);
}

export const createToken = async (name:string)=>{
    const payload = name + (Date.now() + Math.random()).toString();
    const token = bcrypt.hashSync(payload, SALT_BCRYPT);
    return token;
}