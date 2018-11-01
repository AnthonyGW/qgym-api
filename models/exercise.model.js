'use strict';

import mongoose from 'mongoose';

const DefaultExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  steps: {
    type: String,
    required: false
  }
});

const Exercise = mongoose.model('Exercise', DefaultExerciseSchema);
export default Exercise;