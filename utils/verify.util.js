'use strict';

import bcrypt from 'bcrypt';
import { createError } from './error.util';

// verify the entire signup form
const verifySignup = body => {
  return new Promise((resolve, reject) => {
    if( !body.email.replace(/\s+/g, '') || !body.password ){
      return reject(createError("Both email and password are required.", 400));
    }

    if(!/^\w+?\.?\w+@[a-zA-Z0-9_]+?\.[a-zA-Z]{2,3}$/.test(body.email)){
      return reject(createError("Incorrect email format.", 400));
    }

    return resolve();
  });
};

// format new user data
const formatUserData = body => {
  return new Promise((resolve, reject) => {
    let userData = {};
    if(body.email){
      Object.assign(
        userData, 
        { email: body.email.trim() }
      );
    }

    if(body.password){
      Object.assign(
        userData,
        { password: body.password }
      );
    }

    return resolve(userData);
  });
}
export { verifySignup, formatUserData }