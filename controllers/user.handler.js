'use strict';

import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { verifySignup, formatUserData } from '../utils/verify.util';
import { createError } from '../utils/error.util';

class UserController{
  // Methods for sign up, sign in, sign out and update
  static async signUp(req, res, next){
    // Steps:
    // 1. Check the format of the user input
    // 2. Create a new User record with the input data
    // 3. Send errors to the error handling middleware
    try{
      const userData = {
        email: req.body.email.replace(/\s+/g, ''),
        password: req.body.password,
      }
      await verifySignup(userData);

      User.create(userData)
          .then((user) => {
            return res.status(200)
                      .json({ id: user._id, email: user.email });
          }).catch(error => next(error));
    } catch(error){
      return next(error);
    }
  };

  static signIn(req, res, next){
    // Steps:
    // 1. Check the format of the user input
    // 2. Check that the user exists
    // 3. If the user exists, add their database ID to the browser session cookie
    // 4. Send errors to the error handling middleware
    try{
      const userData = {
        email: req.body.email.replace(/\s+/g, ''),
        password: req.body.password
      }
      if( !userData.email || !userData.password )
        throw (createError('All fields required.', 401));
    
      User.authenticate(userData)
          .then(userId => {
            req.session.userId = userId;
            res.status(200)
              .json({'message': 'Authorization successful. ' +
                                'Check session ID named connect.sid in cookies.'});
          }).catch(error => next(error));
    } catch(error){
      return next(error);
    }
  }

  static signOut(req, res, next){
    // Steps:
    // 1. Check if a user ID exists in the session cookie
    // 2. Call the destroy method on the cookie object to expire the session
    // 3. If the user ID is not present, throw a new error
    // 4. Send errors to the error handling middleware
    try{
      if(req.session.userId){
        req.session.destroy(error => {
          if(error) return next(error);
          return res.status(200)
                    .json({message: 'Signed out successfully.'});
        });
      } else {
        throw createError('User must log in to use this feature', 401);
      }
    } catch(error){
      return next(error);
    }
  }

  static async updateUser(req, res, next){
    // Steps:
    // 1. Check if a user ID exists in the session cookie
    // 2. Format the user input
    // 3. If there is a user ID, retrieve the owner from the database
    // 4.0 If for some reason the object is blank,
    // 4.1 Reject the promise with an error
    // 5.0 Check if there already exists an email in the database,
    // 5.1 That matches the one the user wants to update with
    // 6. If the email exists, reject the promise with an error 
    // 7. Check that the provided password is indeed the user's (authorizeUser)
    // 8. If there are no errors, proceed to update the user's records (updateUser)
    // 9. Send errors to the error handling middleware
    try{
      const userID = req.session.userId;
      let newUserData = {
        email: req.body.newEmail,
        password: req.body.newPassword
      }
      newUserData = await formatUserData(newUserData);

      let currentUserData = {
        password: req.body.currentPassword
      }
      currentUserData = await formatUserData(currentUserData);

      const updateUser = () => {
        if(newUserData.password){
          newUserData.password = bcrypt.hashSync(newUserData.password, 10);
        }
        User.updateOne(newUserData)
            .then(user => {
              res.status(200)
                .json({message: 'User data has been updated.'});
            });
      };

      const authorizeUser = () => {
        User.authorize(userID, currentUserData.password)
            .then(updateUser)
            .catch(error => next(error));
      };

      const checkEmail = () => {
        User.findOne({ email: newUserData.email })
            .then(user => {
              if(user) return Promise.reject(createError('That email is already in use.', 403));
            }).then(authorizeUser).catch(error => next(error));
      };

      if(userID){
        User.findById(userID)
            .then(doc => {
              if(!doc) Promise.reject(createError('User not found', 404));
            }).then(checkEmail).catch(error => next(error));
      } else {
        throw createError('User must log in to use this feature.', 401);
      }
    } catch(error){
      return next(error);
    }
  }
}

export default UserController;