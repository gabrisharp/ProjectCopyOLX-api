import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {resolve} from 'path';
import mainRoute from './routes/mainRoute';
import userRoute from './routes/userRoute';
import adRoute from './routes/adRoute';
import {error404, errorHandler} from './middlewares/errorHandler';

dotenv.config();
const port = process.env.PORT;

mongoose.connect(process.env.DATABASE_URI as string, {
    authSource: 'admin',
    user:process.env.DATABASE_USERNAME,
    pass:process.env.DATABASE_PASSWORD
})
    .then(()=>{ app.emit('connected')})
    .catch((err)=>{console.log('ERROR DE CONEXAO\n', err.message)});
mongoose.Promise = global.Promise;

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({extended: true}));
app.use(express.static(resolve(__dirname, '..', 'public')));

app.use(mainRoute);
app.use('/user', userRoute);
app.use('/ad', adRoute);

app.use(errorHandler);
app.use(error404);

app.on('connected', ()=>{
    app.listen(port, ()=>{
        console.log(`Rodando servidor em: http://localhost:${port}`);
    });
});