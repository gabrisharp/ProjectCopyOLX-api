import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

export interface iState{
    name: string,
}

const modelSchema = new mongoose.Schema<iState>({
    name:{type: String, required:true},
});


const State = mongoose.model<iState>('State', modelSchema);

export default State;