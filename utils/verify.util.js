'use strict';

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
};

// format new workout set data
const formatWorkoutData = (body, userId) => {
  return new Promise((resolve, reject) => {
    let workoutData = {};
    if(body.name){
      Object.assign(
        workoutData,
        { name: body.name.trim() }
      )
    }

    if(body.exercises[0] !== ''){
      Object.assign(
        workoutData,
        { exercises: body.exercises }
      )
    }

    if(body.track){
      Object.assign(
        workoutData,
        { track: body.track }
      )
    }

    if(userId){
      Object.assign(
        workoutData,
        { user: userId}
      )
    }

    return resolve(workoutData);
  });
};

const formatWorkoutResponse = responseObject => {
  const response = {
    id: responseObject._id,
    name: responseObject.name,
    exercises: responseObject.exercises,
    track: responseObject.track
  }
  return response;
};

export {
  verifySignup,
  formatUserData,
  formatWorkoutData,
  formatWorkoutResponse
};
