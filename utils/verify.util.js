'use strict';

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

export { verifySignup }