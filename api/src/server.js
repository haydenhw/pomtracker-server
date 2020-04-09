const knex = require('knex')
const app = require('./app')
const { PORT, DB_URL } = require('./config')

if (!DB_URL) {
  throw new Error('DB_URL is undefined. Did you start the server from the project root?')
}

const db = knex({
  client: 'pg',
  connection: DB_URL,
})

app.set('db', db)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
