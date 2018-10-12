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

  after((done) => {
    console.log('Deleting test database');
    mongoose.connection.db.dropDatabase(() => {
      mongoose.connection.close(done);
      process.exit();
    });
  });

  describe('test user sign up', () => {
    it('should sign up a new user', (done)=>{
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
            res.body.should.have.property('_id');
            res.body.should.have.property('email');
            res.body.should.have.property('password');
            done();
          });
    });
  
    it('should not sign up a new user with the same email', (done)=>{
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
  
    it('should not sign up a new user without email', (done)=>{
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
  
    it('should not sign up a new user without password', (done)=>{
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
  
    it('should not sign up a new user with the wrong email format', (done)=>{
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
  
  describe('test user sign in', () => {
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

    it('should not sign in a user without an email', (done)=>{
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

    it('should not sign in a user without an password', (done)=>{
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

    it('should not sign in a user if email does not exist in records', (done)=>{
      const userData = {
        email: 'test2@email.com',
        password: 'testPassword'
      };
      chai.request(server)
          .post(baseURL + '/users/signin')
          .send(userData)
          .end((error, res) => {
            res.should.have.status(401);
            res.should.be.a('object');
            res.body.error.message.should.be.eql('User not found.');
            done();
          });
    });

    it('should not sign in a user if password is wrong', (done)=>{
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
            res.body.error.message.should.be.eql('Wrong password.');
            done();
          });
    });
  });
});
