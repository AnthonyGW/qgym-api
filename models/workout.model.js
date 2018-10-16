'use strict';

import mongoose from 'mongoose';

const WorkoutSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  exercises: {
    type: Array,
    default: [''],
    required: false
  },
  track: {
    type: String,
    default: '',
    required: false
  },
  user: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  updateDate: {
    type: Date,
    default: Date.now,
    required: true
  }
});

WorkoutSchema.statics.retrieveAll = (userId) => {
  return new Promise((resolve, reject) => {
    try{
      const getWorkouts = Workout.find({ user: userId });
      getWorkouts.exec()
                .then(workouts => {
                  if(!workouts) return reject(createError('No records found.', 404));
                  resolve(workouts);
                });
    } catch(error){
      reject(error);
    }
  });
};

WorkoutSchema.pre('save', function(next){
  this.updateDate = new Date();
  next();
});

const Workout = mongoose.model('Workout', WorkoutSchema);
export default Workout;