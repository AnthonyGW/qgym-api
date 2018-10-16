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

      const user = await User.create(userData);
      return res.status(200)
                .json({ id: user._id, email: user.email });
    } catch(error){
      return next(error);
    }
  };

  static async signIn(req, res, next){
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
    
      const userId = await User.authenticate(userData);
      req.session.userId = userId;
      res.status(200)
        .json({'message': 'Authorization successful. ' +
                          'Check session ID named connect.sid in cookies.'});
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
          if(error) throw error;
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

      const updateUser = async () => {
        if(newUserData.password){
          newUserData.password = bcrypt.hashSync(newUserData.password, 10);
        }
        await User.updateOne(newUserData);
        res.status(200)
          .json({message: 'User data has been updated.'});
      };

      const authorizeUser = async () => {
        await User.authorize(userID, currentUserData.password)
        await updateUser();
      };

      const checkEmail = async () => {
        const user = await User.findOne({ email: newUserData.email });
        if(user) return Promise.reject(createError('That email is already in use.', 403));
        await authorizeUser();
      };

      if(userID){
        const doc = await User.findById(userID);
        if(!doc) Promise.reject(createError('User not found', 404));
        await checkEmail();
      } else {
        throw createError('User must log in to use this feature.', 401);
      }
    } catch(error){
      return next(error);
    }
  }
}

export default UserController;