import fileUpload from 'express-fileupload';
import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {resolve} from 'path';
import apiRoutes from './routes/mainRoute';
import {error404, errorHandler} from './middlewares/errorHandler';

dotenv.config();
const port = process.env.PORT;

mongoose.connect(process.env.DATABASE_URI as string)
    .then(()=>{ app.emit('connected')})
    .catch((err)=>{console.log('ERROR DE CONEXAO\N', err.message)});
mongoose.Promise = global.Promise;

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({extended: true}));
app.use(express.static(resolve(__dirname, '..', 'public')));

app.use(apiRoutes);
app.use(error404);
app.use(errorHandler);

app.on('connected', ()=>{
    app.listen(port, ()=>{
        console.log(`Rodando servidor em: http://localhost:${port}`);
    });
});