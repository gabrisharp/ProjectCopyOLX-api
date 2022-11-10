import {ErrorRequestHandler ,Request, Response, NextFunction } from 'express';

export const error404 = (req: Request, res: Response) =>{
    res.status(404).json({error: 'Not found this endpoint'});
}

export const errorHandler: ErrorRequestHandler = (err, req, res, next) =>{
    console.log('=>Error no Handler <=')
    res.status(err.status || 500);
    
    if(!err.message) return res.json({error: 'Something broke'});
    if(err.errors) return res.json({error: err.message, errors: err.errors});
    return res.json({error: err.message});
}
