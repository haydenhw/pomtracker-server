require('dotenv').config()
const knex = require('knex')
const { makeProjectsArray } = require('../test/projects.fixtures')
const { makeTasksArray } = require('../test/tasks.fixtures')

const db = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

db('projects').truncate()
db.into('projects')
  .insert(makeProjectsArray())
  .then(res=> {
    console.log(`Inserted ${res.rowCount} new rows into the projects table`);

    db('tasks').truncate()
    db.into('tasks')
      .insert(makeTasksArray())
      .then(res=> {
        console.log(`Inserted ${res.rowCount} new rows into the tasks table`);
      })
  })

