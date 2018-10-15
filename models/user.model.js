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

// Check if email exists in the database
// If email exists, check if the input password hash matches 
// the one in the database
// If the passwords match, return the user ID,
// otherwise return errors
UserSchema.statics.authenticate = (userData) => {
  return new Promise((resolve, reject) => {
    User.findOne({ email: userData.email })
        .exec((error, user) => {
          if(error) return reject(error);
          if(!user) return reject(createError("User not found.", 404));
          bcrypt.compare(userData.password, user.password)
                .then((result) => {
                  if(result){
                    return resolve(user._id);
                  } else {
                    return reject(createError("Email or password is wrong.", 401));
                  }
                }).catch(error => reject(error));
        });
  });
};

// Check if ID exists in the database
// Retrieve the user and check if the supplied password
// matches the password of the user record.
UserSchema.statics.authorize = (userID, userPassword) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: userID })
      .exec((error, user) => {
        if(error) return reject(error);
        if(!user) return reject(createError("User not found.", 404));
        bcrypt.compare(userPassword, user.password)
              .then((result) => {
                if(result){
                  return resolve(true);
                } else {
                  return reject(createError("Wrong password.", 401));
                }
              }).catch(error => reject(error));
      });
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