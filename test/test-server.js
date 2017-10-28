const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const should = chai.should();

const { Projects } = require('../server-files/models');
const { app, runServer, closeServer } = require('../server');

chai.use(chaiHttp);

const generateTime = () => {
  const hours = Math.floor(Math.random() * 24);
  let minutes = Math.floor(Math.random() * 60);

  if (minutes.toString().length === 1) {
    minutes = `0${minutes}`;
  }

  return `${hours}:${minutes}`;
};

const generateTaskLogEntry = () => {
  return {
    startTime: generateTime(),
    endTime: generateTime(),
  };
};

const generateDataArray = (callback, maxLength) => {
  const arr = [];

  for (let i = 0; i < (Math.random() * maxLength) + 1; i++) {
    arr.push(callback());
  }

  return arr;
};

const generateTask = () => {
  return {
    taskName: faker.lorem.word(),
    totalTime: Math.floor(Math.random() * 20),
    log: generateDataArray(generateTaskLogEntry, 3),
  };
};

const generateProject = () => {
  return {
    projectName: faker.lorem.word(),
    tasks: generateDataArray(generateTask, 3),
  };
};

const seedProjectData = () => {
  const seedData = generateDataArray(generateProject, 2);
  return Projects.insertMany(seedData);
};

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

describe('Projects API resource', () => {
  before(() => {
    return runServer();
  });

  beforeEach(() => {
    return seedProjectData();
  });

  afterEach(() => {
    return tearDownDb();
  });

  after(() => {
    return closeServer();
  });


  describe('/projects GET endpoint', () => {
    it('should return all existing projects', () => {
      let res;
      return chai.request(app)
        .get('/projects')
        .then((_res) => {
          res = _res;
          res.should.have.status(200);
          res.body.projects.should.have.length.of.at.least(1);
          return Projects.count();
        })
        .then((count) => {
          res.body.projects.should.have.length.of(count);
        });
    });

    it('should return projects with right fields', () => {
      let resProject;
      return chai.request(app)
        .get('/projects')
        .then((res) => {
          res.should.have.status(200);
          res.should.be.json;
          res.body.projects.should.be.a('array');
          res.body.projects.should.have.length.of.at.least(1);

          res.body.projects.forEach((project) => {
            project.should.be.a('object');
            project.should.include.keys(
              '_id', 'projectName', 'tasks');
          });

          res.body.projects.forEach((project) => {
            project.tasks.forEach((task) => {
              task.should.be.a('object');
              task.should.include.keys(
                '_id', 'taskName', 'totalTime', 'log');
            });
          });
          resProject = res.body.projects[0];

          return Projects.findById(resProject._id).exec();
        })
        .then((project) => {
          resProject.projectName.should.equal(project.projectName);

          resProject.tasks.forEach((resTask, index) => {
            const task = project.tasks[index];
            resTask.taskName.should.equal(task.taskName);
            resTask.totalTime.should.equal(task.totalTime);

            resTask.log.forEach((resEntry, index) => {
              const entry = task.log[index];
              resEntry.startTime.should.equal(entry.startTime);
              resEntry.endTime.should.equal(entry.endTime);
            });
          });
        });
    });

    it('should respond with a Not Found error if a request is made to a non-existant endpoint', () => {
      return chai.request(app)
        .get('/notAnEndpoint')
        .catch((err) => {
          err.should.have.status(404);
        });
    });
  });

  describe('/projects POST endpoint', () => {
    it('should add a new project', () => {
      const newProject = generateProject();

      return chai.request(app)
        .post('/projects')
        .send(newProject)
        .then((res) => {
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.include.keys('_id', 'projectName', 'tasks');
          res.body._id.should.not.be.null;
          res.body.projectName.should.equal(newProject.projectName);
          res.body.tasks.should.have.length.of(newProject.tasks.length);
          return Projects.findById(res.body._id);
        })
        .then((project) => {
          project.projectName.should.equal(newProject.projectName);

          newProject.tasks.forEach((newTask, index) => {
            const task = project.tasks[index];
            newTask.taskName.should.equal(task.taskName);
            newTask.totalTime.should.equal(task.totalTime);

            newTask.log.forEach((newEntry, index) => {
              const entry = task.log[index];
              newEntry.startTime.should.equal(entry.startTime);
              newEntry.endTime.should.equal(entry.endTime);
            });
          });
        });
    });

    it('should respond with a Bad Request error if fields are missing', () => {
      const newProject = generateProject();
      delete newProject.projectName;

      return chai.request(app)
        .post('/projects')
        .send(newProject)
        .catch((err) => {
          err.should.have.status(400);
        });
    });

    it('should respond with a Conflict error if an atempt is made to create a project that already exists', () => {
      let newProject;

      return Projects
        .findOne()
        .exec()
        .then((project) => {
          newProject = {
            projectName: project.projectName,
            tasks: [],
          };
          return chai.request(app)
            .post('/projects')
            .send(newProject);
        })
        .catch((err) => {
          err.should.have.status(409);
        });
    });
  });

  describe('/projects/:projectId GET endpoint', () => {
    it('should return a single project with corrrect fields', () => {
      let resProject;
      return Projects
        .findOne()
        .exec()
        .then((project) => {
          resProject = project;

          return chai.request(app)
            .get(`/projects/${resProject.id}`)
            .then((res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.projects.should.be.a('object');
              res.body.projects.should.include.keys('_id', 'projectName', 'tasks');

              res.body.projects.tasks.forEach((task) => {
                task.should.include.keys('_id', 'taskName', 'totalTime', 'log');
              });
            });
        });
    });

    it('should respond with a Not Found error if a request is made to non-existant endpoint', () => {
      return chai.request(app)
        .get('/notAnEndpoint/45645789')
        .catch((err) => {
          err.should.have.status(404);
        });
    });
  });

  describe('/projects/:projectId PUT endpoint', () => {
    it('should update specified fields', () => {
      const updateData = {
        projectName: 'Updated Project Name',
      };

      return Projects
        .findOne()
        .exec()
        .then((project) => {
          updateData._id = project._id;
          return chai.request(app)
            .put(`/projects/${project._id}`)
            .send(updateData);
        })
        .then((res) => {
          res.should.have.status(204);

          return Projects.findById(updateData._id).exec();
        })
        .then((projects) => {
          projects.projectName.should.equal(updateData.projectName);
        });
    });

    it('should respond with a Bad Request error if fields are missing', () => {
      const updateData = {
        projectNameMisspelled: 'Updated Project Name',
      };

      return Projects
        .findOne()
        .exec()
        .then((project) => {
          updateData._id = project._id;
          return chai.request(app)
            .put(`/projects/${project._id}`)
            .send(updateData);
        })
        .catch((err) => {
          err.should.have.status(400);
        });
    });

    it('should respond with a Bad Request error if body id and parameter id don\'t match', () => {
      const updateData = {
        projectName: 'Updated Project Name',
      };

      return Projects
        .findOne()
        .exec()
        .then((project) => {
          updateData._id = 123456789;
          return chai.request(app)
            .put(`/projects/${project._id}`)
            .send(updateData);
        })
        .catch((err) => {
          err.should.have.status(400);
        });
    });
  });

  describe('/projects/:projectId DELETE endpoint', () => {
    it('should delete a project by id', () => {
      let project;
      return Projects
        .findOne()
        .exec()
        .then((_project) => {
          project = _project;
          return chai.request(app).delete(`/projects/${project.id}`);
        })
        .then((res) => {
          res.should.have.status(204);
          return Projects.findById(project.id);
        })
        .then((_project) => {
          should.not.exist(_project);
        });
    });

    it('should respond with a Not Found error if parameter id is missing or incorrect', () => {
      return chai.request(app)
        .delete('/projects/123456789')
        .catch((err) => {
          err.should.have.status(404);
        });
    });
  });

  describe('/projects/:projectId/tasks GET endpoint', () => {
    it('should get tasks with correct fields from a single project', () => {
      return Projects
        .findOne()
        .exec()
        .then((project) => {
          const projectId = project.id;
          return chai.request(app)
            .get(`/projects/${projectId}/tasks/`)
            .then((res) => {
              res.should.have.status(200);
              res.should.be.json;
              res.body.tasks.should.be.a('array');
              res.body.tasks.forEach((task) => {
                task.should.include.keys('_id', 'taskName', 'totalTime', 'log');
              });
            });
        });
    });

    it('should respond with a Not Found error if a request is made to non-existant endpoint', () => {
      return chai.request(app)
        .get('/notAnEndpoint/1232456/tasks')
        .catch((err) => {
          err.should.have.status(404);
        });
    });
  });

  describe('/projects/:projectId/tasks/:taskId PUT endpoint', () => {
    it('should update specified fields of a task', () => {
      let taskId;
      const updateData = {
        taskName: 'Updated Task',
        totalTime: 25,
        log: [],
      };

      return Projects
        .findOne()
        .exec()
        .then((project) => {
          updateData.id = project.id;
          taskId = project.tasks[0].id;
          return chai.request(app)
            .put(`/projects/${project.id}/tasks/${taskId}`)
            .send(updateData);
        })
        .then((res) => {
          res.should.have.status(204);

          return Projects.findById(updateData.id).exec();
        })
        .then((project) => {
          project.tasks[0].taskName.should.equal(updateData.taskName);
        });
    });

    it('should respond with a Bad Request error if fields are missing', () => {
      let taskId;
      const updateData = {
        taskName: 'Updated Task',
        log: [],
      };

      return Projects
        .findOne()
        .exec()
        .then((project) => {
          updateData.id = project.id;
          taskId = project.tasks[0].id;
          return chai.request(app)
            .put(`/projects/${project.id}/tasks/${taskId}`)
            .send(updateData);
        })
        .catch((err) => {
          err.should.have.status(400);
        });
    });
  });

  describe('/projects/:projectId/tasks/:taskId PUT endpoint', () => {
    it('should delete a specified task', () => {
      let project;
      let taskId;

      return Projects
        .findOne()
        .exec()
        .then((_project) => {
          project = _project;
          taskId = project.tasks[0].id;
          return chai.request(app)
            .delete(`/projects/${project.id}/tasks/${taskId}`);
        })
        .then((res) => {
          res.should.have.status(204);

          return Projects.findById(project.id);
        })
        .then((project) => {
          should.not.exist(project.tasks.id(taskId));
        });
    });

    it('should respond with a Not Found error if parameter id is missing or incorrect', () => {
      let project;
      let taskId;

      return Projects
        .findOne()
        .exec()
        .then((_project) => {
          project = _project;
          taskId = project.tasks[0].id;
          return chai.request(app)
            .delete(`/projects/${project.id}/tasks/${taskId}`);
        })
        .catch((err) => {
          err.should.have.status(404);
        });
    });
  });
});
