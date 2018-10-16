'use strict';

import Workout from '../models/workout.model';
import { formatWorkoutData, formatWorkoutResponse } from '../utils/verify.util';
import { createError } from '../utils/error.util';

class WorkoutController{
  // Methods for managing a user's workout sets
  static async addWorkoutSet(req, res, next){
    // Steps:
    // 1. Check the format of the workout input
    // 2. Add a new record with the user ID
    // 3. Send errors to the error handling middleware
    try{
      let workoutData = {
        name: req.body.name,
        exercises: req.body.exercises,
        track: req.body.track
      };
      workoutData = await formatWorkoutData(workoutData, req.session.userId);

      const workout = await Workout.create(workoutData);
      res.status(200)
         .json(formatWorkoutResponse(workout));
    } catch(error){
      return next(error);
    }
  }

  static async getAllWorkouts(req, res, next){
    // Steps:
    // 1. Use retrieveAll static method
    // 2. Return a new array of objects with formatted fields
    // 3. Send errors to the error handling middleware
    try{
      let workouts = await Workout.retrieveAll(req.session.userId);
      workouts = workouts.map(workout => formatWorkoutResponse(workout));
      res.status(200)
         .json(workouts);
    } catch(error){
      return next(error);
    }
  }

  static async loadWorkout(req, next, id){
    // Steps:
    // 1. Retrieve the specific record
    // 2. Save the ID in the request object
    // 3. Send errors to the error handling middleware
    try{
      const workout = await Workout.findById(id);
      if(!workout) throw createError('No workout found.', 404);
      req.workoutID = workout._id;
      next();
    } catch(error){
      return next(error);
    }
  }

  static async updateWorkout(req, res, next){
    // Steps:
    // 1. Update the workout record using the stored ID
    // 2. Retrieve the updated record and return it
    // 3. Send errors to the error handling middleware
    try{
      let workout = await Workout.findOneAndUpdate({_id: req.workoutID}, req.body);
      if(!workout) throw createError('No workout to update.', 404);

      if(req.session.userId !== workout.user)
        throw createError('User is not authorized to edit this workout.', 401);

      if(req.body.name === workout.name)
        throw createError('That name has already been used.', 400);

      workout = await Workout.findOne({_id: req.workoutID});
      res.status(200)
         .json(formatWorkoutResponse(workout));
    } catch(error){
      return next(error);
    }
  }

  static async deleteWorkout(req, res, next){
    // Steps:
    // 1. Find the workout record using the stored ID
    // 2. Verify that the action was requested by the owner
    // 3. Remove the record and return a message
    // 4. Send errors to the error handling middleware
    try{
      let workout = await Workout.findOne({_id: req.workoutID});
      if(!workout) throw createError('No workout to delete.', 404);

      if(req.session.userId !== workout.user)
        throw createError('User is not authorized to delete this workout.', 401);

      workout = await Workout.findOneAndRemove({_id: req.workoutID});
      req.workoutID = '';
      res.status(200)
         .json({message: 'Workout deleted.'});
    } catch(error){
      return next(error);
    }
  }
}

export default WorkoutController;