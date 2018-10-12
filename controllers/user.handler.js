import User from '../models/user.model';
import { verifySignup } from '../utils/verify.util';
import { createError } from '../utils/error.util';

class UserController{
  static signUp(req, res, next){
    const userData = {
      email: req.body.email.replace(/\s+/g, ''),
      password: req.body.password,
    }
    const isValid = verifySignup(userData);
    if(!isValid.status) return next(isValid.error);
    User.create(userData, (error, user) => {
      if(error) return next(error);
      res.status(200)
          .json(user);
    });
  }

  static signIn(req, res, next){
    const userData = {
      email: req.body.email.replace(/\s+/g, ''),
      password: req.body.password
    }
    if( !userData.email || !userData.password )
      return next(createError('All fields required.', 401));
  
    User.authenticate(userData, (error, userId) => {
      if(error) return next(error);
      req.session.userId = userId;
      res.status(200)
         .json({'message': 'Authorization successful. Check session ID named connect.sid in cookies.'});
    });
  }
}

export default UserController;