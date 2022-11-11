import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

export interface iUser{
    name: string,
    email: string,
    passwordHash: string,
    token: string,
    state: string,
    id?:string
}

const modelSchema = new mongoose.Schema<iUser>({
    name:{type: String, required:true},
    email:{type: String, required:true},
    state:{type: String, required:true},
    passwordHash:{type: String, required:true},
    token:{type: String},
});


const User = mongoose.model<iUser>('User', modelSchema);

export default User;