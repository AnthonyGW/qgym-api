'use strict';

import express from 'express';
import * as mid from '../middlewares/auth.middleware';
import Workout from '../controllers/workout.handler';

const router = express.Router();

router.param("workoutID", (req, res, next, id) => {
  Workout.loadWorkout(req, next, id);
});

/*
  POST api/v1/workouts
*/
router.route('/')
      .post(mid.requiresSignin, Workout.addWorkoutSet);

/*
  GET api/v1/workouts
*/
router.route('/')
      .get(mid.requiresSignin, Workout.getAllWorkouts);

/*
  PUT api/v1/workouts/:workoutID
*/
router.route('/:workoutID')
      .put(mid.requiresSignin, Workout.updateWorkout);

/*
  DELETE api/v1/workouts/:workoutID
*/
router.route('/:workoutID')
      .delete(mid.requiresSignin, Workout.deleteWorkout);
export default router;