const shouldDeleteDb = false;

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// const shouldResetDb = false;

const { PORT, DATABASE_URL } = require('./server-files/config');
const { Projects } = require('./server-files/models');
// const { sampleData } = require('./server-files/sampleData');

const projectRouter = require('./server-files/routes/projectRouter');
const taskRouter = require('./server-files/routes/taskRouter');

mongoose.Promise = global.Promise;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

projectRouter.use('/:id/tasks', taskRouter);
app.use('/projects', projectRouter);
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not Found' });
});

//     const seedData = sampleData.projects;
//
//     return Projects.insertMany(seedData);
// };
// function resetDb() {
//     return new Promise((resolve, reject) => {
//         console.warn('Resetting database');
//         mongoose.connection.dropDatabase()
//     .then((result) => {
//         seedSampleData();
//         resolve(result);
//     })
//     .catch((err) => { return reject(err); });
//     });
// }
function tearDownDb() {
    return new Promise((resolve, reject) => {
        console.warn('Deleting database');
        mongoose.connection.dropDatabase()
      .then((result) => { return resolve(result); })
      .catch((err) => { return reject(err); });
    });
}

// if (shouldResetDb === true) {
//     resetDb();
// }

if (shouldDeleteDb === true) {
    tearDownDb();
}

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, (err) => {
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
    runServer().catch((err) => { return console.error(err); });
}

module.exports = { app, runServer, closeServer };
