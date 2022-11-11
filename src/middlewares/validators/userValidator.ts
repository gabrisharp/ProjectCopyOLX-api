import { checkSchema} from 'express-validator';
import { Types } from 'mongoose';

export const editInfo = checkSchema({
    token:{
        notEmpty: true,
    },
    name:{
        optional: true,
        trim: true,   //sanityze
        notEmpty: true,      
        isLength: {
            options: {min: 2}
        },
        errorMessage: 'Name needs at lest 2 characters'
    },
    email: {
        optional: true,
        isEmail: true,
        normalizeEmail: true, //trim, all lowercase
        errorMessage: 'Invalid email'
    }, 
    password: {
        optional: true,
        isLength: {
            options: {min: 5}
        },
        errorMessage: 'Password needs at least 5 characters'
    },
    state: {
        optional: true,
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
