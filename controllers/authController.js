const User = require("../models/User");
const {StatusCodes} = require('http-status-codes')
const CustomError= require('../errors')
const jwt= require('jsonwebtoken');
const { createJWT, attachCookiesToResponse } = require("../utils");
const register= async (req, res)=>{
    const {name, email, password}= req.body
    const existingEmail= await User.findOne({email})
    if(existingEmail){
        throw new CustomError.BadRequestError("Email already exist");
    }
    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    // // Check if password matches the requirements I want if not throw the below error
    // if (!passwordRegex.test(password)) {
    //      throw new CustomError.BadRequestError("Password must contain at least 8 characters, a capital letter, a small letter, a number, and a special character.");
    // }

    // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? 'admin' : 'user';

    const user= await User.create({name, email, password, role}) 
    const tokenUser={name:user.name, userId:user._id, role:user.role}
    // const token= createJWT({payload:tokenUser}) //using the utils to allow for reusability
    attachCookiesToResponse({res, user:tokenUser})
    res.status(StatusCodes.CREATED).json({user:tokenUser});
};

const login= async (req, res)=>{
    const {email, password}= req.body;
    if (!email || !password){
        throw new CustomError.BadRequestError("Please provide email and password");
    }
    const user= await User.findOne({email});
    if (!user){
        throw new CustomError.UnauthenticatedError("Invalid Credentials")
    }
     
    const passwordIsCorrect= await user.comparePassword(password);
    if(!passwordIsCorrect){
        throw new CustomError.UnauthenticatedError("Invalid Credentials")
    }
    const tokenUser={name:user.name, userId:user._id, role:user.role}
    attachCookiesToResponse({res, user:tokenUser})
    res.status(StatusCodes.OK).json({user:tokenUser})
};


const logout= async (req, res)=>{
    res.cookie('token', 'logout',{
        httpOnly:true,
        expires:new Date(Date.now())
    }) 
    res.status(StatusCodes.OK).json({msg:'logout successful'})
};


module.exports={register, login, logout}