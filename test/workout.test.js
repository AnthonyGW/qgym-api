'use strict';

import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

import server from '../server';
import Workout from '../models/workout.model';

chai.use(chaiHttp);

const should = chai.should();
const baseURL = '/api/v1';

const userSignin = async (callback, user=1) => {
  const signinData1 = {
    email: 'test@email.com',
    password: 'testPassword'
  }
  const signinData2 = {
    email: 'test@email2.com',
    password: 'testPassword2'
  }
  let signinData = '';
  if(user === 1){
    signinData = signinData1;
  } else {
    signinData = signinData2;
  }
  try{
    const reqAgent = chai.request.agent(server);
    const res = await reqAgent.post(baseURL + '/users/signin')
                              .send(signinData)
    res.should.have.cookie('connect.sid');
    callback(reqAgent);
  } catch(error){
    console.log(error.message);
  }
};

describe('workout tests', () => {

  before(done => {
    Workout.deleteMany({}, done);
  });

  describe('add test data', () => {

    it('should add a new user', done => {
      const userData = {
        email: 'test@email.com',
        password: 'testPassword'
      };

      chai.request(server)
          .post(baseURL + '/users/signup')
          .send(userData)
          .end((error, res) => {
            error ? console.log(error.message):console.log('Added test user.');
            done();
          });
    });

    it('should add a new user', done => {
      const userData = {
        email: 'test@email2.com',
        password: 'testPassword2'
      };

      chai.request(server)
          .post(baseURL + '/users/signup')
          .send(userData)
          .end((error, res) => {
            error ? console.log(error.message):console.log('Added test user.');
            done();
          });
    });
  });
  
  
  describe('test user can create workouts', () => {

    it('should create a new workout', done => {
      const workoutData = {
        name: 'workout1',
        exercises: [''],
        track: ''
      };
      const createWorkout = agent => {
        agent.post(baseURL + '/workouts')
            .send(workoutData)
            .then(res => {
              res.should.have.status(200);
              res.body.should.deep.include(workoutData);
              done();
            }).catch(error => console.log(error.message));
      };
      userSignin(createWorkout);
    });
  
    it('should not create a workout without a name', done => {
      const workoutData = {
        name: '',
        exercises: [''],
        track: ''
      };
      const createWorkout = agent => {
        agent.post(baseURL + '/workouts')
            .send(workoutData)
            .then(res => {
              res.should.have.status(400);
              res.body.error.message.should.be.eql('Name is required.');
              done();
            }).catch(error => console.log(error.message));;
      };
      userSignin(createWorkout);
    });

    it('should not create a workout with the same name', done => {
      const workoutData = {
        name: 'workout1',
        exercises: [''],
        track: ''
      };
      const createWorkout = agent => {
        agent.post(baseURL + '/workouts')
            .send(workoutData)
            .then(res => {
              res.should.have.status(400);
              res.body.error.message.should.be.eql('That name has already been used.');
              done();
            }).catch(error => console.log(error.message));;
      };
      userSignin(createWorkout);
    });
  
    it('should not create a workout if user is not logged in', done => {
      const workoutData = {
        name: 'workout2',
        exercises: [''],
        track: ''
      };
      chai.request(server)
          .post(baseURL + '/workouts')
          .send(workoutData)
          .end((error, res) => {
            res.should.have.status(401);
            res.body.error.message.should.be.eql('Access denied. User must be logged in.');
            done();
          });
    });

    it('should create another test user\'s workout', done => {
      const workoutData = {
        name: 'workout2',
        exercises: ['Jumping Jacks'],
        track: '47382901-90'
      };
      const createWorkout = agent => {
        agent.post(baseURL + '/workouts')
            .send(workoutData)
            .then(res => {
              res.should.have.status(200);
              res.body.should.deep.include(workoutData);
              done();
            }).catch(error => console.log(error.message));
      };
      userSignin(createWorkout, 2);
    });
  });
  
  describe('test user can read and manipulate their workouts', () => {

    it('should return a user\'s workouts', done => {
      const workoutData = {
        name: 'workout1',
        exercises: [''],
        track: ''
      };
      const getWorkouts = agent => {
        agent.get(baseURL + '/workouts')
            .then(res => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              res.body[0].should.deep.include(workoutData);
              done();
            }).catch(error => console.log(error.message));
      };

      userSignin(getWorkouts);
    });

    it('should not return another user\'s workouts', done => {
      const workoutData = {
        name: 'workout1',
        exercises: [''],
        track: ''
      };

      const workoutData2 = {
        name: 'workout2',
        exercises: ['Jumping Jacks'],
        track: '47382901-90'
      };

      const getWorkouts = agent => {
        agent.get(baseURL + '/workouts')
            .then(res => {
              res.should.have.status(200);
              res.body.should.be.an('array');
              res.body[0].should.not.deep.include(workoutData);
              res.body[0].should.deep.include(workoutData2);
              done();
            }).catch(error => console.log(error.message));
      };

      userSignin(getWorkouts, 2);
    });

    it('should update a user\'s workout', done => {
      const newWorkoutData = {
        exercises: ['Crunches']
      };

      const updateWorkout = (agent, workoutID) => {
        agent.put(baseURL + '/workouts/' + workoutID)
            .send(newWorkoutData)
            .then(res => {
              res.should.have.status(200);
              res.body.should.be.an('object');
              res.body.should.deep.include(newWorkoutData);
              done();
            }).catch(error => console.log(error.message));
      };

      const getWorkout = agent => {
        agent.get(baseURL + '/workouts')
            .then(res => {
              res.should.have.status(200);
              updateWorkout(agent, res.body[0].id)
            }).catch(error => console.log(error.message));
      };

      userSignin(getWorkout)
    });

    it('should return 404 if a workout does not exist when updating', done => {
      const newWorkoutData = {
        exercises: ['Crunches']
      };

      const updateWorkout = agent => {
        agent.put(baseURL + '/workouts/nonexistent')
            .send(newWorkoutData)
            .then(res => {
              res.should.have.status(404);
              res.body.error.message.should.eql('Workout not found.');
              done();
            }).catch(error => console.log(error.message));
      };

      userSignin(updateWorkout)
    });

    it('should not duplicate a workout\'s name', done => {
      const newWorkoutData = {
        name: 'workout1'
      };

      const updateWorkout = (agent, workoutID) => {
        agent.put(baseURL + '/workouts/' + workoutID)
            .send(newWorkoutData)
            .then(res => {
              res.should.have.status(400);
              res.body.error.message.should.be.eql('That name has already been used.');
              done();
            }).catch(error => console.log(error.message));
      };

      const getWorkout = agent => {
        agent.get(baseURL + '/workouts')
            .then(res => {
              res.should.have.status(200);
              updateWorkout(agent, res.body[0].id)
            }).catch(error => console.log(error.message));
      };

      userSignin(getWorkout)
    });

    it('should not update another user\'s workout', async () => {
      try{
        const signinData = {
          email: 'test@email.com',
          password: 'testPassword'
        };
        const signinData2 = {
          email: 'test@email2.com',
          password: 'testPassword2'
        };
        const newWorkoutData = {
          exercises: ['Crunches']
        };  

        // Sign in as User 1 and retrieve a workout ID
        const agent = chai.request.agent(server);
        const res = await agent.post(baseURL + '/users/signin')
                              .send(signinData);
        res.should.have.cookie('connect.sid');
        const workoutRes = await agent.get(baseURL + '/workouts');
        workoutRes.should.have.status(200);
        const signoutRes = await agent.get(baseURL + '/users/signout');
        signoutRes.should.have.status(200);

        // Sign in as User 2 and attempt to update the workout ID
        const res2 = await agent.post(baseURL + '/users/signin')
                                .send(signinData2);
        res2.should.have.cookie('connect.sid');
        const workoutRes2 = await agent.put(baseURL + '/workouts/' + workoutRes.body[0].id)
                                      .send(newWorkoutData);
        return new Promise((resolve, reject) => {
          try{
            workoutRes2.should.have.status(401);
            workoutRes2.body.error.message.should.be
            .eql('User is not authorized to edit this workout.');
            resolve();
          } catch(error){
            reject(error);
          }
        });
      } catch(error){
        console.log(error.message);
      }
    });

    it('should delete a user\'s workout', done => {

      const deleteWorkout = (agent, workoutID) => {
        agent.delete(baseURL + '/workouts/' + workoutID)
            .then(res => {
              res.should.have.status(200);
              res.body.message.should.eql('Workout deleted.');
              done();
            }).catch(error => console.log(error.message));
      };

      const getWorkout = agent => {
        agent.get(baseURL + '/workouts')
            .then(res => {
              res.should.have.status(200);
              deleteWorkout(agent, res.body[0].id)
            }).catch(error => console.log(error.message));
      };

      userSignin(getWorkout)
    });

    it('should return 404 if a workout does not exist when deleting', done => {
      const deleteWorkout = agent => {
        agent.delete(baseURL + '/workouts/nonexistent')
            .then(res => {
              res.should.have.status(404);
              res.body.error.message.should.eql('Workout not found.');
              done();
            }).catch(error => console.log(error.message));
      };

      userSignin(deleteWorkout)
    });

    it('should create a new workout', done => {
      const workoutData = {
        name: 'workout1',
        exercises: [''],
        track: ''
      };
      const createWorkout = agent => {
        agent.post(baseURL + '/workouts')
            .send(workoutData)
            .then(res => {
              res.should.have.status(200);
              res.body.should.deep.include(workoutData);
              done();
            }).catch(error => console.log(error.message));
      };
      userSignin(createWorkout);
    });

    it('should not delete another user\'s workout', async () => {
      try{
        const signinData = {
          email: 'test@email.com',
          password: 'testPassword'
        };
        const signinData2 = {
          email: 'test@email2.com',
          password: 'testPassword2'
        };

        // Sign in as User 1 and retrieve a workout ID
        const agent = chai.request.agent(server);
        const res = await agent.post(baseURL + '/users/signin')
                              .send(signinData);
        res.should.have.cookie('connect.sid');
        const workoutRes = await agent.get(baseURL + '/workouts');
        workoutRes.should.have.status(200);
        const signoutRes = await agent.get(baseURL + '/users/signout');
        signoutRes.should.have.status(200);

        // Sign in as User 2 and attempt to delete the workout ID
        const res2 = await agent.post(baseURL + '/users/signin')
                                .send(signinData2);
        res2.should.have.cookie('connect.sid');
        const workoutRes2 = await agent.delete(baseURL + '/workouts/' + workoutRes.body[0].id)

        return new Promise((resolve, reject) => {
          try{
            workoutRes2.should.have.status(401);
            workoutRes2.body.error.message.should.be
            .eql('User is not authorized to delete this workout.');
            resolve();
          } catch(error){
            reject(error);
          }
        });
      } catch(error){
        console.log(error.message);
      }
    });

  });
});
