import { checkSchema, CustomValidator} from 'express-validator';
import {Types} from 'mongoose'

export const register = checkSchema({
    name:{
        trim: true, //sanityze
        notEmpty: true,
        isLength: {
            options: {min: 2}
        },
        errorMessage: 'Name needs at lest 2 characters'
    },
    email: {
        isEmail: true,
        normalizeEmail: true, //trim, all lowercase
        errorMessage: 'Invalid email'
    }, 
    password: {
        isLength: {
            options: {min: 5}
        },
        errorMessage: 'Password needs at least 5 characters'
    },
    state: {
        trim:true,
        notEmpty: true,
        custom: {
            options: (value) =>{
               if(!Types.ObjectId.isValid(value)){
                    throw new Error('State code invalid');
               } return value;
            }
        },
        errorMessage: 'State not filled'
    }
});

export const login = checkSchema({
    email: {
        isEmail: true,
        normalizeEmail: true, //trim, all lowercase
        errorMessage: 'Invalid email'
    }, 
    password: {
        isLength: {
            options: {min: 5}
        },
        errorMessage: 'Password needs at least 5 characters'
    },
});