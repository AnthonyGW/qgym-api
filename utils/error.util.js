'use strict';

// error classification that can be made human-readable
let error_types = {
  "That email is already in use.": /^E11000 duplicate key error.+email_1/g,
};

// generate an error with a custom message and status code
const createError = (message, status) => {
  var err = new Error(message);
  err.status = status;
  return err;
}

// refactor error messages to be more user friendly
const refactorError = (error) => {
  for(let error_type in error_types){
    if(error.message.search(error_types[error_type]) !== -1){
      error.message = error_type;
      error.status = 400;
    }
  }
  return error;
}

export { createError, refactorError };