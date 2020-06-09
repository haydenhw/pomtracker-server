const path = require('path')
const express = require('express')
const xss = require('xss')
const ProjectsService = require('./projects-service')
const TasksService = require('../tasks/tasks-service')

const projectsRouter = express.Router()
const jsonParser = express.json()

const serializeProject = project => ({
  id: project.id,
  user_id: project.user_id,
  client_id: project.client_id ? xss(project.client_id) : null,
  project_name: xss(project.project_name),
  date_created: project.date_created,
  // TODO serialize tasks also
  tasks: project.tasks
})

projectsRouter
  .route('/')
  .get(async (req, res, next) => {
    const knexInstance = req.app.get('db')
    const user_id = req.query.userid

    try {
      const tasks = await TasksService.getAllTasks(knexInstance)
      let projects = await ProjectsService.getProjectsByUserId(knexInstance, user_id)
      if (projects.length === 0) {
        return res.json({
          error: {message: 'No projects for supplied user id found'}
        })
      }
      projects = projects.map(project => {
        const childTasks = tasks.filter(t => t.project_id === project.id)
        return {
          ...project,
          tasks: childTasks
        }
      })
      res.json(projects.map(serializeProject))
    } catch (err) {
      next(err);
    }
  })
  .post(jsonParser, async (req, res, next) => {
    let {project_name, client_id, user_id, tasks} = req.body
    const newProject = {project_name, client_id, user_id}

    for (const [key, value] of Object.entries(newProject))
      if (value == null)
        return res.status(400).json({
          error: {message: `Missing '${key}' in request body`}
        })

    const knexInstance = req.app.get('db');
    const savedProject = await ProjectsService.insertProject(
      knexInstance,
      newProject
    )

    let savedTasks;
    if (tasks) {
      const newTasks = tasks.map(t => {
        const {client_id, user_id, task_name, recorded_time} = t;
        t = {client_id, user_id, task_name, recorded_time};
        t.project_id = savedProject.id;
        return t;
      })
      savedTasks = await TasksService.insertTasks(knexInstance, newTasks)
      savedProject.tasks = savedTasks
    }
    res
      .status(201)
      .location(path.posix.join(req.originalUrl, `/${savedProject.id}`))
      .json(serializeProject(savedProject))
  })

projectsRouter
  .route('/:project_id')
  .all((req, res, next) => {
    ProjectsService.getById(
      req.app.get('db'),
      req.params.project_id
    )
      .then(project => {
        if (!project) {
          return res.status(404).json({
            error: {message: `Project doesn't exist`}
          })
        }
        res.project = project
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeProject(res.project))
  })
  .delete((req, res, next) => {
    ProjectsService.deleteProject(
      req.app.get('db'),
      req.params.project_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const {project_name, client_id} = req.body
    const projectToUpdate = {project_name, client_id}

    const numberOfValues = Object.values(projectToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'project_name' or 'client_id'`
        }
      })

    ProjectsService.updateProject(
      req.app.get('db'),
      req.params.project_id,
      projectToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

module.exports = projectsRouter
