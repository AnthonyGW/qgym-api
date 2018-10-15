'use strict';

import chai from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

import server from '../server';
import User from '../models/user.model';

chai.use(chaiHttp);

const should = chai.should();
const baseURL = '/api/v1';

describe('user authentication tests', () => {

  before((done) => {
    User.deleteMany({}, (err) => { 
      done();           
    });
  });

  describe('test user sign up', () => {
    it('should sign up a new user', (done) => {
      const userData = {
        email: 'test@email.com',
        password: 'testPassword'
      };
      chai.request(server)
          .post(baseURL + '/users/signup')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.should.have.property('id');
            res.body.should.have.property('email');
            done();
          });
    });
  
    it('should not sign up a new user with the same email', (done) => {
      const userData = {
        email: 'test@email.com',
        password: 'testPassword'
      };
  
      chai.request(server)
          .post(baseURL + '/users/signup')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('email is in use');
            done();
          });
    });
  
    it('should not sign up a new user without email', (done) => {
      const userData = {
        email: '',
        password: 'testPassword'
      };
      chai.request(server)
          .post(baseURL + '/users/signup')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('Both email and password are required.');
            done();
          });
    });
  
    it('should not sign up a new user without password', (done) => {
      const userData = {
        email: 'test@email.com',
        password: ''
      };
      chai.request(server)
          .post(baseURL + '/users/signup')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('Both email and password are required.');
            done();
          });
    });
  
    it('should not sign up a new user with the wrong email format', (done) => {
      const userData = {
        email: 'testemail.com',
        password: 'testPassword'
      };
      chai.request(server)
          .post(baseURL + '/users/signup')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(400);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('Incorrect email format.');
            done();
          });
    });
  });
  
  describe('test user sign in and functionality', () => {
    it('should sign in a user', (done)=>{
      const userData = {
        email: 'test@email.com',
        password: 'testPassword'
      };
      chai.request(server)
          .post(baseURL + '/users/signin')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(200);
            res.should.be.a('object');
            res.body.message.should.be.eql('Authorization successful. Check session ID named connect.sid in cookies.');
            done();
          });
    });

    it('should not sign in a user without an email', (done) => {
      const userData = {
        email: '',
        password: 'testPassword'
      };
      chai.request(server)
          .post(baseURL + '/users/signin')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(401);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('All fields required.');
            done();
          });
    });

    it('should not sign in a user without an password', (done) => {
      const userData = {
        email: 'test@email.com',
        password: ''
      };
      chai.request(server)
          .post(baseURL + '/users/signin')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(401);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('All fields required.');
            done();
          });
    });

    it('should not sign in a user if email does not exist in records', (done) => {
      const userData = {
        email: 'test2@email.com',
        password: 'testPassword'
      };
      chai.request(server)
          .post(baseURL + '/users/signin')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(404);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('User not found.');
            done();
          });
    });

    it('should not sign in a user if password is wrong', (done) => {
      const userData = {
        email: 'test@email.com',
        password: 'testPassword2'
      };
      chai.request(server)
          .post(baseURL + '/users/signin')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(401);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('Email or password is wrong.');
            done();
          });
    });
  });
});

describe('user functionality tests', () => {

  before((done) => {
    User.deleteMany({}, (err) => { 
      done();           
    });
  });

  after((done) => {
    console.log('Deleting test database');
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
      process.exit();
    });
  });

  describe('test user can update their account details', () => {
    it('should sign up a new user', (done) => {
      const userData = {
        email: 'test2@email.com',
        password: 'testPassword'
      };
      chai.request(server)
          .post(baseURL + '/users/signup')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(200);
            done();
          });
    });

    it('should update a user email', (done) => {
      const loginData = {
        email: 'test2@email.com',
        password: 'testPassword'
      };
      const userData = {
        currentPassword: 'testPassword',
        newEmail: 'test2@email2.com'
      };
      const updateData = () => {
        reqAgent.put(baseURL + '/users/update')
                .send(userData)
                .then((res) => {
                  res.should.have.status(200);
                  res.body.message.should.be.eql('User data has been updated.');
                  done();
                });
      };

      const reqAgent = chai.request.agent(server);
      reqAgent.post(baseURL + '/users/signin')
              .send(loginData)
              .then((res) => {
                res.should.have.cookie('connect.sid');
                updateData();
              });
    });

    it('should update a user password', (done) => {
      const loginData = {
        email: 'test2@email2.com',
        password: 'testPassword'
      };
      const userData = {
        currentPassword: 'testPassword',
        newPassword: 'testPassword2'
      };
      const updateData = () => {
        reqAgent.put(baseURL + '/users/update')
                .send(userData)
                .then((res) => {
                  res.should.have.status(200);
                  res.body.message.should.be.eql('User data has been updated.');
                  done();
                });
      };

      const reqAgent = chai.request.agent(server);
      reqAgent.post(baseURL + '/users/signin')
              .send(loginData)
              .then((res) => {
                res.should.have.cookie('connect.sid');
                updateData();
              });
    });

    it('should not update if user is not logged in', (done) => {
      const userData = {
        currentPassword: 'testPassword',
        newEmail: 'test2@email2.com'
      };
      chai.request(server)
          .put(baseURL + '/users/update')
          .send(userData)
          .then((res) => {
            res.should.have.status(401);
            res.body.message.should.be.eql('User must log in to use this feature.');
            done();
          });
    });

    it('should not update if user has entered the wrong current password', (done) => {
      const loginData = {
        email: 'test2@email2.com',
        password: 'testPassword2'
      };
      const userData = {
        currentPassword: 'testPassword',
        newEmail: 'test2@email3.com'
      };
      const updateData = () => {
        reqAgent.put(baseURL + '/users/update')
                .send(userData)
                .then((res) => {
                  res.should.have.status(401);
                  res.body.error.message.should.be.eql('Wrong password.');
                  done();
                });
      };

      const reqAgent = chai.request.agent(server);
      reqAgent.post(baseURL + '/users/signin')
              .send(loginData)
              .then((res) => {
                res.should.have.cookie('connect.sid');
                updateData();
              });
    });

    it('should not update if user has entered an existing email', (done) => {
      const loginData = {
        email: 'test2@email2.com',
        password: 'testPassword2'
      };
      const userData = {
        currentPassword: 'testPassword2',
        newEmail: 'test2@email2.com'
      };
      const updateData = () => {
        reqAgent.put(baseURL + '/users/update')
                .send(userData)
                .then((res) => {
                  res.should.have.status(403);
                  res.body.message.should.be.eql('That email is already in use.');
                  done();
                });
      };

      const reqAgent = chai.request.agent(server);
      reqAgent.post(baseURL + '/users/signin')
              .send(loginData)
              .then((res) => {
                res.should.have.cookie('connect.sid');
                updateData();
              });
    });

    it('should log out a logged in user', (done) => {
      const userData = {
        email: 'test2@email2.com',
        password: 'testPassword2'
      };

      const reqAgent = chai.request.agent(server);
      reqAgent.post(baseURL + '/users/signin')
              .send(userData)
              .then((res) => {
                res.should.have.status(200);
                res.should.have.cookie('connect.sid');
                reqAgent.get(baseURL + '/users/signout')
                        .then((res) => {
                          res.should.have.status(200);
                          done();
                        });
              });
    });
  });
});
