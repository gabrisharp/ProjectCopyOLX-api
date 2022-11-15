import {checkSchema} from 'express-validator';
import {Types} from 'mongoose';

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
        custom: { options: value =>{ 
            if(!Types.ObjectId.isValid(value)){
                throw new Error ('Invalid category code');
            }
            return value;
        }},
        errorMessage: 'Categories uninformed',
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

export const getItem = checkSchema({
    id:{
        notEmpty: true,
        custom: { options: value =>{
            if(!Types.ObjectId.isValid(value)){
                throw new Error('Invalid Id');
            }return value;
        }},
        errorMessage: 'Id must be informed'
    }
});

export const edit = checkSchema({
    token:{
        notEmpty: true,
    },
    id:{
        notEmpty: true,
        custom: { options: value =>{
            if(!Types.ObjectId.isValid(value)){
                throw new Error('Invalid Id');
            }return value;
        }},
        errorMessage: 'Id must be informed'
    },
    title:{
        optional: true,
        notEmpty: true,
        trim: true,
        isLength: {
            options: {min:2}
        },
        errorMessage: 'Title must have at least 2 characters'
    },
    status: {
        optional: true,
        isBoolean: true,
        customSanitizer: {options: value =>{
            value = value == 'true'? true : false;
            return value
        }},
        errorMessage: 'Status must be true or false'
    },
    catg:{
        optional:true,
        notEmpty: true,
        custom: { options: value =>{ 
            if(!Types.ObjectId.isValid(value)){
                throw new Error ('Invalid category code');
            }
            return value;
        }},
        errorMessage: 'Categories uninformed',
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
        customSanitizer: {options: value =>{
            value = value == 'true'? true : false;
            return value
        }},
        errorMessage: 'Price negociable invalid'
    }, 
    desc:{
        optional: true,
    }
});