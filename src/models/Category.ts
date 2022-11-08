import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

export interface iCategory{
    name: string,
    slug: string
}

const modelSchema = new mongoose.Schema<iCategory>({
    name:{type: String, required:true},
    slug:{type: String, required:true},
});


const Category = mongoose.model<iCategory>('Category', modelSchema);

export default Category;