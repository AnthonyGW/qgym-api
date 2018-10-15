'use strict';

import bcrypt from 'bcrypt';
import { createError } from './error.util';

// verify the entire signup form
const verifySignup = (body) => {
  if( !body.email.replace(/\s+/g, '') || !body.password ){
    return {
      status: false,
      error: createError("Both email and password are required.", 400)
    };
  }

  if(!/^\w+?\.?\w+@[a-zA-Z0-9_]+?\.[a-zA-Z]{2,3}$/.test(body.email)){
    return {
      status: false,
      error: createError("Incorrect email format.", 400)
    };
  }

  return {status: true};
};

// format new user data
const formatUserData = (body) => {
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

  return userData;
}
export { verifySignup, formatUserData }