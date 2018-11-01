'use strict';

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { createError } from '../utils/error.util';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});

const checkUser = async (user, password, resolve, reject) => {
  try{
    if(!user) return reject(createError("Authentication failed. Email or password not found", 404));
    const result = await bcrypt.compare(password, user.password);
    if(result){
      return resolve(user._id);
    } else {
      return reject(createError("Authentication failed. Email or password not found", 401));
    }
  } catch(error){
    reject(error)
  }
};

// Check if email exists in the database
// If email exists, check if the input password hash matches 
// the one in the database
// If the passwords match, return the user ID,
// otherwise return errors
UserSchema.statics.authenticate = (userData) => {
  return new Promise((resolve, reject) => {
    try{
      const findUser = User.findOne({ email: userData.email });
      findUser.exec()
              .then(user => checkUser(user,
                                      userData.password,
                                      resolve,
                                      reject));
    } catch(error){
      reject(error);
    }
  });
};

// Check if ID exists in the database
// Retrieve the user and check if the supplied password
// matches the password of the user record.
UserSchema.statics.authorize = (userID, userPassword) => {
  return new Promise((resolve, reject) => {
    const findUser = User.findOne({ _id: userID });
    findUser.exec()
            .then(user => checkUser(user,
                                    userPassword,
                                    resolve,
                                    reject))
            .catch(error => reject(error));
  });
};

// Encrypt password before saving it in the database
UserSchema.pre('save', function(next){
  const user = this;
  bcrypt.hash(user.password, 10, (err, hash) => {
    if(err) return next(err);
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', UserSchema);
export default User;