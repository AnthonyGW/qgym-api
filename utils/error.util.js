'use strict';

// error classification that can be made human-readable
const error_types = {
  "That email is already in use.": [/^E11000 duplicate key error.+email_1/g, 400],
  "Name is required.": [/Path `name` is required/g, 400],
  "That name has already been used.": [/^E11000 duplicate key error.+name_1/g, 400],
  "Workout not found.": [/^Cast to.+failed.+for model "Workout"/g, 404]
};

// generate an error with a custom message and status code
const createError = (message, status) => {
  const err = new Error(message);
  err.status = status;
  return err;
}

// refactor error messages to be more user friendly
const refactorError = (error) => {
  for(let error_type in error_types){
    if(error.message.search(error_types[error_type][0]) !== -1){
      error.message = error_type;
      error.status = error_types[error_type][1];
    }
  }
  return error;
}

export { createError, refactorError };
