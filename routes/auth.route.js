'use strict';

import express from 'express';
import User from '../controllers/user.handler';

const router = express.Router();

/*
  POST v1/users/signup
*/
router.route('/signup')
      .post(User.signUp);

/*
  POST v1/users/signin
*/
router.route('/signin')
      .post(User.signIn);

/*
  GET v1/users/signout
*/
router.route('/signout')
      .get(User.signOut);

/*
  PUT v1/users/update
*/
router.route('/update')
      .put(User.updateUser);

export default router;