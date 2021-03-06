const knex = require('knex')
const app = require('../src/app')
const {makeProjectsArray, makeMaliciousProject} = require('./projects.fixtures')
const {makeTasksArray} = require('./tasks.fixtures')

describe('Projects Endpoints', function () {
  let db

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean the table', () => {
    return db.raw('TRUNCATE TABLE projects CASCADE')
  })

  afterEach('clean the table', () => {
    return db.raw('TRUNCATE TABLE projects CASCADE')
  })

  describe(`GET /api/projects`, () => {
    context(`Given no projects`, () => {
      it(` responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/projects')
          .expect(200, [])
      })
    })

    context('Given there are projects in the database', () => {
      const testTasks = makeTasksArray()
      const projects = makeProjectsArray()
      const testProjects = projects.map(project => {
        const childTasks = testTasks.filter(t => t.project_id === project.id)
        return {
          ...project,
          tasks: childTasks
        }
      })

      beforeEach('insert projects', async () => {
        await db.into('projects').insert(projects)
        await db.into('tasks').insert(testTasks)
      })

      it('responds with 200 and all of the projects', () => {
        return supertest(app)
          .get('/api/projects')
          .expect(200, testProjects)
      })
    })

    context(`Given an XSS attack project`, () => {
      const {maliciousProject, expectedProject} = makeMaliciousProject()

      beforeEach('insert malicious project', () => {
        return db
          .into('projects')
          .insert([maliciousProject])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/projects`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].project_name).to.eql(expectedProject.project_name)
            expect(res.body[0].client_id).to.eql(expectedProject.client_id)
          })
      })
    })
  })

  describe(`GET /api/projects/:project_id`, () => {
    context(`Given no projects`, () => {
      it(`responds with 404`, () => {
        const projectId = 123456
        return supertest(app)
          .get(`/api/projects/${projectId}`)
          .expect(404, {error: {message: `Project doesn't exist`}})
      })
    })

    context('Given there are projects in the database', () => {
      const testProjects = makeProjectsArray()

      beforeEach('insert projects', () => {
        return db
          .into('projects')
          .insert(testProjects)
      })

      it('responds with 200 and the specified project', () => {
        const projectId = 2
        const expectedProject = testProjects[projectId - 1]
        return supertest(app)
          .get(`/api/projects/${projectId}`)
          .expect(200, expectedProject)
      })
    })

    context(`Given an XSS attack project`, () => {
      const {maliciousProject, expectedProject} = makeMaliciousProject()

      beforeEach('insert malicious project', () => {
        return db
          .into('projects')
          .insert([maliciousProject])
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/projects/${maliciousProject.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.project_name).to.eql(expectedProject.project_name)
            expect(res.body.client_id).to.eql(expectedProject.client_id)
          })
      })
    })
  })

  describe(`POST /api/projects`, () => {
    const testTasks = makeTasksArray()
    const projects = makeProjectsArray()
    const testProjects = projects.map(project => {
      const childTasks = testTasks.filter(t => t.project_id === project.id)
      return {
        ...project,
        tasks: childTasks
      }
    })
    it(`creates a project, responding with 201 and the new project`, () => {
      const newProject = testProjects[0];
      return supertest(app)
        .post('/api/projects')
        .send(newProject)
        .expect(201)
        .expect(res => {
          expect(res.body.project_name).to.eql(newProject.project_name)
          expect(res.body.client_id).to.eql(newProject.client_id)
          expect(res.body).to.have.property('id')
          expect(res.headers.location).to.eql(`/api/projects/${res.body.id}`)
          // const expected = new Date().getSeconds()
          // const actual = new Date(res.body.date_created).getSeconds()
          // expect(actual - expected).to.eql(expected)
        })
    })

    const requiredFields = ['project_name', 'client_id', 'user_id']

    requiredFields.forEach(field => {
      const newProject = {
        project_name: 'Test new project',
        client_id: 'abc',
        user_id: 2,
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newProject[field]
        console.log(newProject)

        return supertest(app)
          .post('/api/projects')
          .send(newProject)
          .expect(400, {
            error: {message: `Missing '${field}' in request body`}
          })
      })
    })

    it('removes XSS attack content from response', () => {
      const {maliciousProject, expectedProject} = makeMaliciousProject()
      return supertest(app)
        .post(`/api/projects`)
        .send(maliciousProject)
        .expect(201)
        .expect(res => {
          expect(res.body.project_name).to.eql(expectedProject.project_name)
          expect(res.body.client_id).to.eql(expectedProject.client_id)
        })
    })
  })

  describe(`DELETE /api/projects/:project_id`, () => {
    context(`Given no projects`, () => {
      it(`responds with 404`, () => {
        const projectId = 123456
        return supertest(app)
          .delete(`/api/projects/${projectId}`)
          .expect(404, {error: {message: `Project doesn't exist`}})
      })
    })

    context('Given there are projects in the database', () => {
      const testProjects = makeProjectsArray()

      beforeEach('insert projects', () => {
        return db
          .into('projects')
          .insert(testProjects)
      })

      it('responds with 204 and removes the project', () => {
        const idToRemove = 2
        const expectedProjects = testProjects.filter(project => project.id !== idToRemove)
        return supertest(app)
          .delete(`/api/projects/${idToRemove}`)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/projects`)
              .expect(expectedProjects)
          )
      })
    })
  })

  describe(`PATCH /api/projects/:project_id`, () => {
    context(`Given no projects`, () => {
      it(`responds with 404`, () => {
        const projectId = 123456
        return supertest(app)
          .delete(`/api/projects/${projectId}`)
          .expect(404, {error: {message: `Project doesn't exist`}})
      })
    })

    context('Given there are projects in the database', () => {
      const testProjects = makeProjectsArray()

      beforeEach('insert projects', () => {
        return db
          .into('projects')
          .insert(testProjects)
      })

      it('responds with 204 and updates the project', () => {
        const idToUpdate = 2
        const updateProject = {
          project_name: 'updated project project_name',
          client_id: 'abc',
        }
        const expectedProject = {
          ...testProjects[idToUpdate - 1],
          ...updateProject
        }
        return supertest(app)
          .patch(`/api/projects/${idToUpdate}`)
          .send(updateProject)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/projects/${idToUpdate}`)
              .expect(expectedProject)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/projects/${idToUpdate}`)
          .send({irrelevantField: 'foo'})
          .expect(400, {
            error: {
              message: `Request body must contain either 'project_name' or 'client_id'`
            }
          })
      })

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updateProject = {
          project_name: 'updated project name',
        }
        const expectedProject = {
          ...testProjects[idToUpdate - 1],
          ...updateProject
        }

        return supertest(app)
          .patch(`/api/projects/${idToUpdate}`)
          .send({
            ...updateProject,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/projects/${idToUpdate}`)
              .expect(expectedProject)
          )
      })
    })
  })
})
