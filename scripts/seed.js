#!/usr/local/bin/node
'use strict';

import mongoose from 'mongoose';
import config from 'config';
import Workout from '../models/workout.model';
const DBURL = `${process.env.DBServer}://${process.env.DBUser}:` +
              `${process.env.DBPassword}@${process.env.DBHost}/` +
              config.get('DBName');

// Connect to database
const options = {
  useNewUrlParser: true
};

mongoose.connect(DBURL, options);
const db = mongoose.connection;
db.on('error', err => {
  console.error('Database connection error:', err);
});

db.once('open', () => {
  console.log('Connected to database ' + config.get('DBName'));
});

const workoutData = {
  name: '8 Minute Workout',
  exercises: [
    'jumpingJacks',
    'wallSit',
    'pushUp',
    'crunches',
    'stepUpOntoChair',
    'squat',
    'tricepdips',
    'plank',
    'highKnees',
    'lunges',
    'pushupNRotate',
    'sidePlank'
  ],
  user: 'General',
  description: `A basic workout plan that has all the exercises with no repetition.
  <br>
  You are not fit until you can beat this in one go.`,
  track: 'imaxx-ableton/survivor-eye-of-the-tigerimaxx-remix'
}

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
const exerciseData = [
  {
    name: 'rest',
    title: 'Resting Time',
    description: 'Relax, stretch and get ready for the next exercise.',
    image: 'rest.png'
  },
  {
    name: 'jumpingJacks',
    title: 'Jumping Jacks',
    description: 'A jumping jack or star jump, also called side-straddle hop is a physical jumping exercise.',
    image: 'JumpingJacks.png',
    steps: `Assume an erect position, with feet together and arms at your side. <br>
                Slightly bend your knees, and propel yourself a few inches into the air. <br>
                While in air, bring your legs out to the side about shoulder width or slightly wider. <br>
                As you are moving your legs outward, you should raise your arms up over your head; <br>
                arms should be slightly bent throughout the entire in-air movement. <br>
                Your feet should land shoulder width or wider as your hands meet above your head with arms slightly bent`
  },
  {
    name: 'wallSit',
    title: 'Wall Sit',
    description: 'A wall sit, also known as a Roman Chair, is an exercise done to strengthen the quadriceps muscles.',
    image: 'wallsit.png',
    steps: `Place your back against a wall with your feet shoulder width apart and a little ways out from the wall. <br>
             Then, keeping your back against the wall, lower your hips until your knees form right angles.`
  },
  {
    name: 'pushUp',
    title: 'Push up',
    description: 'A push-up is a common exercise performed in a prone position by raising and lowering the body using the arms',
    image: 'Pushup.png',
    steps: `Lie prone on the ground with hands placed as wide or slightly wider than shoulder width. <br>
              Keeping the body straight, lower body to the ground by bending arms at the elbows. <br>
              Raise body up off the ground by extending the arms.`
  },
  {
    name: 'crunches',
    title: 'Abdominal Crunches',
    description: 'The basic crunch is a abdominal exercise in a strength-training program.',
    image: 'crunches.png',
    steps: `Lie on your back with your knees bent and feet flat on the floor, hip-width apart. <br>
              Place your hands behind your head so your thumbs are behind your ears. <br>
              Hold your elbows out to the sides but rounded slightly in. <br>
              Gently pull your abdominals inward. <br>
              Curl up and forward so that your head, neck, and shoulder blades lift off the floor. <br>
              Hold for a moment at the top of the movement and then lower slowly back down.`
  },
  {
    name: 'stepUpOntoChair',
    title: 'Step Up Onto Chair',
    description: 'Step exercises are ideal for building muscle in your lower body.',
    image: 'stepUpOntoChair.png',
    steps: `Position your chair in front of you. <br>
            Stand with your feet about hip width apart, arms at your sides. <br>
            Step up onto the seat with one foot, pressing down while bringing your other foot up next to it. <br>
            Step back with the leading foot and bring the trailing foot down to finish one step-up.`
  },
  {
    name: 'squat',
    title: 'Squat',
    description: 'The squat is a compound, full body exercise that trains primarily the muscles of the thighs, hips, buttocks and quads.',
    image: 'squat.png',
    steps: `Stand with your head facing forward and your chest held up and out. <br>
              Place your feet shoulder-width apart or little wider. Extend your hands straight out in front of you. <br>
              Sit back and down like you're sitting into a chair. Keep your head facing straight as your upper body bends <br>
              forward a bit. Rather than allowing your back to round, let your lower back arch slightly as you go down. <br>
              Lower down so your thighs are parallel to the floor, with your knees over your ankles. <br>
              Press your weight back into your heels. <br>
              Keep your body tight, and push through your heels to bring yourself back to the starting position.`
  },
  {
    name: 'tricepdips',
    title: 'Tricep Dips On Chair',
    description: 'A body weight exercise that targets triceps.',
    image: 'tricepdips.png',
    steps: `Sit up on a chair. Your legs should be slightly extended, with your feet flat on the floor. <br>
            Place your hands edges of the chair. Your palms should be down, fingertips pointing towards the floor. <br>
            Without moving your legs, bring your glutes forward off the chair. <br>
            Steadily lower yourself. When your elbows form 90 degrees angles, push yourself back up to starting position.`
  },
  {
    name: 'plank',
    title: 'Plank',
    description: 'The plank (also called a front hold, hover, or abdominal bridge) is an isometric core strength exercise that involves' +
      ' maintaining a difficult position for extended periods of time.',
    image: 'Plank.png',
    steps: `Get into pushup position on the floor. <br>
              Bend your elbows 90 degrees and rest your weight on your forearms. <br>
              Your elbows should be directly beneath your shoulders, and your body should form a straight line from head to feet. <br>
              Hold this position.`
  },
  {
    name: 'highKnees',
    title: 'High Knees',
    description: 'A form exercise that develops strength and endurance of the hip flexors and quads and stretches the hip extensors.',
    image: 'highknees.png',
    steps: `Start standing with feet hip-width apart. <br>
              Do inplace jog with your knees lifting as much as possible towards your chest.`
  },
  {
    name: 'lunges',
    title: 'Lunges',
    description: 'Lunges are a good exercise for strengthening, sculpting and building several muscles/muscle groups. including the quadriceps (or thighs), the gluteus maximus (or buttocks) as well as the hamstrings.',
    image: 'lunges.png',
    steps: `Start standing with feet hip-width apart. <br>
              Do inplace jog with your knees lifting as much as possible towards your chest.`
  },
  {
    name: 'pushupNRotate',
    title: 'Pushup And Rotate',
    description: 'A variation of pushup that requires you to rotate.',
    image: 'pushupNRotate.png',
    steps: `Assume the classic pushup position, but as you come up, rotate your body so your right arm lifts up and extends overhead. <br>
              Return to the starting position, lower yourself, then push up and rotate till your left hand points toward the ceiling.`
  },
  {
    name: 'sidePlank',
    title: 'Side Plank',
    description: 'A variation to Plank done using one hand only.',
    image: 'sideplank.png',
    steps: `Lie on your side, in a straight line from head to feet, resting on your forearm. <br>
              Your elbow should be directly under your shoulder. <br>
              With your abdominals gently contracted, lift your hips off the floor, maintaining the line. <br>
              Keep your hips square and your neck in line with your spine. Hold the position.`
  }
]

Workout.deleteMany({name: '8 Minute Workout', user: 'General'})
      .then((err, res) => {
        console.log('Deleted default workout');
        Workout.create(workoutData)
              .then(workout => console.log('Added workout: ', workout.name))
              .catch(error => console.error(error))
      }).then((err, res) => {
        Exercise.deleteMany({})
        .then(() => {
          console.log('Deleted exercises.')
          exerciseData.forEach(exercise => {
            Exercise.create(exercise)
                    .then(exercise => console.log('Added exercise: ', exercise.name))
                    .catch(error => console.error(error));
          });
        }).catch(error => console.error(error));
      }).catch(error => console.error(error));
