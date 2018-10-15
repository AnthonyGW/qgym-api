'use strict';

import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { verifySignup, formatUserData } from '../utils/verify.util';
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
          .json({ id: user._id, email: user.email });
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
         .json({'message': 'Authorization successful. ' +
                           'Check session ID named connect.sid in cookies.'});
    });
  }

  static signOut(req, res, next){
    if(req.session.userId){
      req.session.destroy(error => {
        if(error) return next(error);
        return res.status(200)
              .json({message: 'Logged out successfully.'});
      });
    } else {
      return res.status(401).json({message: 'User must log in to use this feature'});
    }
  }

  static updateUser(req, res, next){
    const userID = req.session.userId;
    let newUserData = {
      email: req.body.newEmail,
      password: req.body.newPassword
    }
    newUserData = formatUserData(newUserData);

    let currentUserData = {
      password: req.body.currentPassword
    }
    currentUserData = formatUserData(currentUserData);

    if(userID){
      User.findById(userID, (err, doc) => {
        if(err) return next(err);
        if(!doc){
          err = new Error('User not found.');
          err.status = 404;
          return next(err);
        }
        User.findOne({ email: newUserData.email }, (error, user) => {
          if(err) return next(err);
          if(!user){
            User.authorize(userID, currentUserData.password, (error, condition) => {
              if(error) return next(error);
              if(condition){
                if(newUserData.password){
                  newUserData.password = bcrypt.hashSync(newUserData.password, 10);
                }
                User.updateOne(newUserData, (error, user) => {
                  if(error) return next(error);
                  res.status(200)
                     .json({message: 'User data has been updated.'});
                });
              }
            });
          } else {
            return res.status(403).json({message: 'That email is already in use.'})
          }
        });
      });
    } else {
      return res.status(401).json({message: 'User must log in to use this feature.'});
    }
  }
}

export default UserController;