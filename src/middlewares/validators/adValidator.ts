import {checkSchema} from 'express-validator';

export const add = checkSchema({
    token:{
        notEmpty: true,
    },
    title:{
        notEmpty: true,
        trim: true,
        isLength: {
            options: {min:2}
        },
        errorMessage: 'Title must have at least 2 characters'
    },
    catg:{
        notEmpty: true,
        trim: true,
        errorMessage: 'Categories not uninformed',
    },
    price: {
        optional: true,
        isNumeric: true,
        custom: { options: value =>{
            if(value <= 0.5) throw new Error('Price must be greater than 0');
            return value;
        }},
        errorMessage: 'Price invalid'
    },
    priceneg: {
        optional: true,
        isBoolean: true,
        errorMessage: 'Price negociable invalid'
    }, 
    desc:{
        optional: true,
    }
});
