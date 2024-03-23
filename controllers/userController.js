const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError =  require("../errors");
const { checkPermissions } = require("../utils");

const getAllUsers= async(req, res)=>{
    console.log(req.user)// req.user is passed from authentication middleware
    const users= await User.find({role:'user'}).select('-password');
    res.status(StatusCodes.OK).json({users})
};

const getSingleUser= async(req, res)=>{
    const {id}= req.params;
    const user= await User.findOne({_id:id}).select('-password')
    if(!user){
        throw new CustomError.NotFoundError(`user with id ${id} not found`)
    }
    checkPermissions(req.user, user._id)
    res.status(StatusCodes.OK).json({user})
};

const showCurrentUser= async(req, res)=>{
    res.status(StatusCodes.OK).json({user:req.user})
};

// const updateUser= async(req, res)=>{
//     const {name, email} = req.body;
//     if(!name|| !email){
//         throw new CustomError.BadRequestError("Name of username missing");
//     };
//     const user= await User.findOneAndUpdate({_id:req.user.userId}, {name, email}, {new:true, runValidators:true})
//     const tokenUser={name:user.name, userId:user._id, role:user.role};
//     res.status(StatusCodes.OK).json({user:tokenUser});
// };

// using user.save
const updateUser= async (req, res)=>{
    const {name, email} = req.body;
    if(!name|| !email){
        throw new CustomError.BadRequestError("Name of username missing");
    };
    const user= await User.findOne({_id:req.user.userId});
    user.email=email;
    user.name=name;
    await user.save();
    const tokenUser={name:user.name, userId:user._id, role:user.role};
        res.status(StatusCodes.OK).json({user:tokenUser});
}


const updateUserPassword= async(req, res)=>{
    const {oldPassword, newPassword} =  req.body;
    if(!oldPassword || !newPassword){
        throw new CustomError.BadRequestError("Old or New password missing");
        
    }
    const user= await User.findOne({_id:req.user.userId});
    const isPasswordCorrect= await user.comparePassword(oldPassword)

    if(!isPasswordCorrect){
        throw new CustomError.UnauthenticatedError("Old password not correct");
    }
    user.password=newPassword;

    await user.save(); //we can use findone rather than this but in that case, we will need to hash the password. for this, the schema defines a pre save which hashes the pword with bcrypt
    res.status(StatusCodes.OK).json({msg: "password updated succesfully"});
};


module.exports={getAllUsers, getSingleUser, showCurrentUser, updateUser, updateUserPassword }
