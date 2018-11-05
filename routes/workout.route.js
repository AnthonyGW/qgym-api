'use strict';

import express from 'express';
import * as mid from '../middlewares/auth.middleware';
import Workout from '../controllers/workout.handler';

const router = express.Router();

router.param("workoutID", (req, res, next, id) => {
  Workout.loadWorkout(req, next, id);
});

/*
  POST v1/workouts
*/
router.route('/')
      .post(mid.requiresSignin, Workout.addWorkoutSet);

/*
  GET v1/workouts
*/
router.route('/')
      .get(mid.requiresSignin, Workout.getAllWorkouts);

/*
  GET v1/workouts/default
*/
router.route('/default')
      .get(Workout.getDefaultWorkout);

/*
  GET v1/workouts/exercises
*/
router.route('/exercises')
      .get(Workout.getDefaultExercises);

/*
  PUT v1/workouts/:workoutID
*/
router.route('/:workoutID')
      .put(mid.requiresSignin, Workout.updateWorkout);

/*
  DELETE v1/workouts/:workoutID
*/
router.route('/:workoutID')
      .delete(mid.requiresSignin, Workout.deleteWorkout);
export default router;