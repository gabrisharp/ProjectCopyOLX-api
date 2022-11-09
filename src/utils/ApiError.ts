import {Result, ValidationError} from 'express-validator';

type errorsType = object[] | string [] | Result<ValidationError>;

class ApiError extends Error{
    status?: number;
    errors?: errorsType;
    constructor(message: string, status?:number, errors?:errorsType){
        super(message);

        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.status = status;
        this.errors = errors;
    }
}

export default ApiError;