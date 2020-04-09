const knex = require('knex')
const app = require('../src/app')
const { makeTasksArray, makeMaliciousTask } = require('./tasks.fixtures')

describe('Tasks Endpoints', function() {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => db('tasks').truncate())

  afterEach('cleanup',() => db('tasks').truncate())

  describe(`GET /api/tasks`, () => {
    context(`Given no tasks`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/tasks')
          .expect(200, [])
      })
    })

    context('Given there are tasks in the database', () => {
      const testTasks = makeTasksArray()

      beforeEach('insert tasks', () => {
        return db
          .into('tasks')
          .insert(testTasks)
      })

      it('responds with 200 and all of the tasks', () => {
        return supertest(app)
          .get('/api/tasks')
          .expect(200, testTasks)
      })
    })

    context(`Given an XSS attack task`, () => {
      const { maliciousTask, expectedTask } = makeMaliciousTask()

      beforeEach('insert malicious task', () => {
        return db
          .into('tasks')
          .insert([ maliciousTask ])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/tasks`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].task_name).to.eql(expectedTask.task_name)
            expect(res.body[0].client_id).to.eql(expectedTask.client_id)
          })
      })
    })
  })

  describe(`GET /api/tasks/:task_id`, () => {
    context(`Given no tasks`, () => {
      it(`responds with 404`, () => {
        const taskId = 123456
        return supertest(app)
          .get(`/api/tasks/${taskId}`)
          .expect(404, { error: { message: `Task doesn't exist` } })
      })
    })

    context('Given there are tasks in the database', () => {
      const testTasks = makeTasksArray()

      beforeEach('insert tasks', () => {
        return db
          .into('tasks')
          .insert(testTasks)
      })

      it('responds with 200 and the specified task', () => {
        const taskId = 2
        const expectedTask = testTasks[taskId - 1]
        return supertest(app)
          .get(`/api/tasks/${taskId}`)
          .expect(200, expectedTask)
      })
    })

    context(`Given an XSS attack task`, () => {
      const { maliciousTask, expectedTask } = makeMaliciousTask()

      beforeEach('insert malicious task', () => {
        return db
          .into('tasks')
          .insert([ maliciousTask ])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/tasks/${maliciousTask.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.task_name).to.eql(expectedTask.task_name)
            expect(res.body.client_id).to.eql(expectedTask.client_id)
          })
      })
    })
  })

  describe(`POST /api/tasks`, () => {
    it(`jjcreates a task, responding with 201 and the new task`, () => {
      const newTask = {
        task_name: 'Test new task',
        client_id: 'abc',
        recorded_time: 123,
        project_id: 1,
        user_id: 1,
      }
      return supertest(app)
        .post('/api/tasks')
        .send(newTask)
        .expect(201)
        .expect(res => {
          expect(res.body.task_name).to.eql(newTask.task_name)
          expect(res.body.client_id).to.eql(newTask.client_id)
          expect(res.body.recorded_time).to.eql(newTask.recorded_time)
          expect(res.body.project_id).to.eql(newTask.project_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/tasks/${res.body.id}`)
          // const expected = new Date().getSeconds()
          // const actual = new Date(res.body.date_created).getSeconds()
          // expect(actual - expected).to.eql(expected)
        })
        .then(res =>
          supertest(app)
            .get(`/api/tasks/${res.body.id}`)
            .expect(res.body)
        )
    })

    const requiredFields = ['task_name', 'client_id', 'recorded_time', 'project_id']

    requiredFields.forEach(field => {
      const newTask = {
        task_name: 'Test new task',
        client_id: 'abc',
        recorded_time: 123,
        project_id: 2,
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newTask[field]

        return supertest(app)
          .post('/api/tasks')
          .send(newTask)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const { maliciousTask, expectedTask } = makeMaliciousTask()
      return supertest(app)
        .post(`/api/tasks`)
        .send(maliciousTask)
        .expect(201)
        .expect(res => {
          expect(res.body.task_name).to.eql(expectedTask.task_name)
          expect(res.body.client_id).to.eql(expectedTask.client_id)
        })
    })
  })

  describe(`DELETE /api/tasks/:task_id`, () => {
    context(`Given no tasks`, () => {
      it(`responds with 404`, () => {
        const taskId = 123456
        return supertest(app)
          .delete(`/api/tasks/${taskId}`)
          .expect(404, { error: { message: `Task doesn't exist` } })
      })
    })

    context('Given there are tasks in the database', () => {
      const testTasks = makeTasksArray()

      beforeEach('insert tasks', () => {
        return db
          .into('tasks')
          .insert(testTasks)
      })

      it('responds with 204 and removes the task', () => {
        const idToRemove = 2
        const expectedTasks = testTasks.filter(task => task.id !== idToRemove)
        return supertest(app)
          .delete(`/api/tasks/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/tasks`)
              .expect(expectedTasks)
          )
      })
    })
  })

  describe(`PATCH /api/tasks/:task_id`, () => {
    context(`Given no tasks`, () => {
      it(`responds with 404`, () => {
        const taskId = 123456
        return supertest(app)
          .delete(`/api/tasks/${taskId}`)
          .expect(404, { error: { message: `Task doesn't exist` } })
      })
    })

    context('Given there are tasks in the database', () => {
      const testTasks = makeTasksArray()

      beforeEach('insert tasks', () => {
        return db
          .into('tasks')
          .insert(testTasks)
      })

      it('responds with 204 and updates the task', () => {
        const idToUpdate = 2
        const updateTask = {
          task_name: 'updated task task_name',
          client_id: 'abc',
          recorded_time: 4000,
        }
        const expectedTask = {
          ...testTasks[idToUpdate - 1],
          ...updateTask
        }
        return supertest(app)
          .patch(`/api/tasks/${idToUpdate}`)
          .send(updateTask)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/tasks/${idToUpdate}`)
              .expect(expectedTask)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/tasks/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain either  'task_name', 'client_id', 'project_id', 'recorded_time'`
            }
          })
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateTask = {
          recorded_time: 73737,
        }
        const expectedTask = {
          ...testTasks[idToUpdate - 1],
          ...updateTask
        }

        return supertest(app)
          .patch(`/api/tasks/${idToUpdate}`)
          .send({
            ...updateTask,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/tasks/${idToUpdate}`)
              .expect(expectedTask)
          )
      })
    })
  })
})
