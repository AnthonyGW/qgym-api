'use strict';

import express from 'express';

// Import middleware
import morgan from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import cors from 'cors';

import config from 'config';

// Import routes
import authRoutes from './routes/auth.route';
import workoutRoutes from './routes/workout.route';

import { refactorError } from './utils/error.util';

// Create Express App
const app = express();

const MongoStore = connectMongo(session);

// Declare app variables
const port = config.get('PORT');
const sessionSecret = config.get('SESSION_SECRET');
const baseURL = '/v1';
const DBURL = config.get('DBURL');

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
  console.log('Connected to database ' + DBURL);
});

let sessionData = {};

// Use application middleware
if(config.util.getEnv('NODE_ENV') !== 'test'){
  app.set('trust proxy', true);
  app.use(morgan('combined'));
  sessionData = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: db
    }),
    cookie: {
      secure: 'auto',
      httpOnly: false,
      maxAge: 6.048e+8
    },
    proxy: true
  };
} else {
  sessionData = {
    secret: sessionSecret,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    })
  };
}

app.use(express.json());

app.use(session(sessionData));

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: [config.get('APP_SOURCE'), 'http://localhost:4200'],
  credentials: true
}));

// Use routes
app.use(baseURL+'/users', authRoutes);
app.use(baseURL+'/workouts', workoutRoutes);

// Catch 404 errors and pass to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  err = refactorError(err);
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

app.listen(port, () => {
  console.log("Server is listening on port", port);
});

export default app;