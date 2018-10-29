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
const baseURL = '/api/v1';
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

// Use application middleware
if(config.util.getEnv('NODE_ENV') !== 'test'){
  app.use(morgan('combined'));
}
app.use(express.json());
app.use(session({
  secret: sessionSecret,
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Enable Cross-Origin Resource Sharing
app.use(cors({
  origin: [config.get('APP_SOURCE')], credentials: true
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