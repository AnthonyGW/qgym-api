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

// Check if email and password input exist in the database
// If user is authenticated, supply an encrypted token with the user ID
UserSchema.statics.authenticate = (userData, callback) => {
  User.findOne({ email: userData.email })
  .exec((error, user) => {
    if(error) return callback(error, null);
    if(!user) return callback(createError("User not found.", 404), null);
    bcrypt.compare(userData.password, user.password, (error, result) => {
      if(!error && result){
        return callback(null, user._id);
      } else if(!error && !result){
        return callback(createError("Email or password is wrong.", 401), null);
      }
      return callback(error, null);
    });
  });
};

UserSchema.statics.authorize = (userID, userPassword, callback) => {
  User.findOne({ _id: userID })
      .exec((error, user) => {
        if(error) return callback(error, null);
        if(!user) return callback(createError("User not found.", 404), null);
        bcrypt.compare(userPassword, user.password, (error, result) => {
          if(!error && result){
            return callback(null, true);
          } else if(!error && !result){
            return callback(createError("Wrong password.", 401), null);
          }
          return callback(error, null);
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