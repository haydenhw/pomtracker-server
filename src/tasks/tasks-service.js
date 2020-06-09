const TasksService = {
  getAllTasks(knex) {
    return knex.select('*').from('tasks')
  },
  insertTasks(knex, newTask) {
    return knex
      .insert(newTask)
      .into('tasks')
      .returning('*')
      .then(rows => {
        return rows
      })
  },
  getById(knex, id) {
    return knex.from('tasks').select('*').where('id', id).first()
  },
  deleteTask(knex, id) {
    return knex('tasks')
      .where({ id })
      .delete()
  },
  updateTask(knex, id, newTaskFields) {
    return knex('tasks')
      .where({ id })
      .update(newTaskFields)
  },
}

module.exports = TasksService
