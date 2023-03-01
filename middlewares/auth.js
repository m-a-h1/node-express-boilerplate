const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { roleRights } = require('../config/roles');
const { verifyToken } = require('../services/token.service');
const { userService } = require('../services');
const { tokenTypes } = require('../config/tokens');

const verifyCallback = (req, resolve, reject, requiredRights) => async () => {

  let token = req.headers["authorization"];

  if (!token) {
    return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }

 let find_by_token = await verifyToken(token,tokenTypes.REFRESH)

 if (!find_by_token) {
  return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
}
let user = await userService.getUserById(find_by_token.user)
    console.log(user)
    req.user = user;
    console.log(user.user)

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      let hasRequiredRights 
       try{
        hasRequiredRights = requiredRights.every((requiredRight) => userRights.includes(requiredRight));
       }catch(e){

        return reject(new ApiError(httpStatus.NOT_ACCEPTABLE, 'YOU DONT HAVE ACCESS'));
       }
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
      }
    }
  
    resolve();
  

};

const auth = (...requiredRights) => async (req, res, next) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights))(req, res, next);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = auth;
