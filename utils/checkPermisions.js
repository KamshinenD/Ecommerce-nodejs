const CustomError= require('../errors')

const checkPermissions=(requestUser, resourceUserId)=>{
    if (requestUser.role==='admin') return;
    if(requestUser.userId === resourceUserId.toString()) return;
    throw new CustomError.UnauthorizeddError("Not authorised to access this route")
};


module.exports= checkPermissions;