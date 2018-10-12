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

export default router;