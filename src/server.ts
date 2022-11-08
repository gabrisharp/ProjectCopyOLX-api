import express from 'express';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import dotenv from 'dotenv';
import cors from 'cors';
import {resolve} from 'path';

dotenv.config();
const port = process.env.PORT;

mongoose.connect(process.env.DATABASE_URI as string)
    .then(()=>{ console.log('Deu certo')})
    .catch((err)=>{console.log('ERROR DE CONEXAO\N', err.message)});
mongoose.Promise = global.Promise;

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(express.urlencoded({extended: true}));
app.use(express.static(resolve(__dirname, '..', 'public')));

app.listen(port, ()=>{
    console.log(`Rodando servidor em: http://localhost:${port}`);
})