'use strict';

import express from 'express';
import User from '../controllers/user.handler';

const router = express.Router();

/*
  POST api/v1/users/signup
*/
router.route('/signup')
      .post(User.signUp);

router.route('/signin')
      .post(User.signIn);

router.route('/signout')
      .get(User.signOut);

router.route('/update')
      .put(User.updateUser);

export default router;