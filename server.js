require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const { localStrategy, jwtStrategy } = require('./api/strategies');
const { PORT, DATABASE_URL } = require('./api/config');
const authRouter = require('./api/routes/authRouter');
const projectRouter = require('./api/routes/projectRouter');
const taskRouter = require('./api/routes/taskRouter');
const userRouter = require('./api/routes/userRouter');


mongoose.Promise = global.Promise;
const app = express();
const shouldDeleteDb = false;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
passport.use(localStrategy);
passport.use(jwtStrategy);

projectRouter.use('/:id/tasks', taskRouter);
app.use('/auth', authRouter);
app.use('/projects', projectRouter);
app.use('/users', userRouter);
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

if (shouldDeleteDb === true) {
  tearDownDb();
}

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, { useMongoClient: true }, (err) => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', (err) => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
