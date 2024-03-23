const CustomError = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
  try {
    const payload = isTokenValid({ token });
    // console.log(payload)
    const { name, userId, role } = payload;
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

// const authorizePermissions=(req, res, next)=>{
//    if(req.user.role !=='admin'){
//       throw new CustomError.UnauthorizeddError("Unauthorized to access this route")
//    }
//    next();
// }
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizeddError("Unauthorised to access this route");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
