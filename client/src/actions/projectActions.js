import shortid from 'shortid';
import { getUser, getJWTAuthHeader } from '../helpers/users';
import { projectsUrl } from '../config/endpointUrls';

export const ADD_PROJECT = 'ADD_PROJECT';
export function addProject(projectName) {
  const newProject = {
    projectName,
    tasks: [],
    shortId: shortid.generate(),
  };

  return {
    type: 'ADD_PROJECT',
    project: newProject,
  };
}

export const DELETE_PROJECT_REQUEST = 'DELETE_PROJECT_REQUEST';
export function deleteProject(project) {
  return (dispatch) => {
    dispatch({
      type: 'DELETE_PROJECT_REQUEST',
      project,
    });

    fetch(
      `${projectsUrl}/${project._id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      });
  };
}

export const DELETE_TASK_REQUEST = 'DELETE_TASK_REQUEST';
export function deleteTask(project, task, updateLocalState = false) {
  return (dispatch) => {
    if (updateLocalState) {
      dispatch({
        type: 'DELETE_TASK_REQUEST',
        projectId: project.shortId,
        taskId: task.shortId,
      });
    }

    fetch(
      `${projectsUrl}/${project._id}/tasks/${task._id}`,
      {
        method: 'DELETE',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      });
  };
}

export const POST_PROJECT_REQUEST = 'POST_PROJECT_REQUEST';
export const POST_PROJECT_SUCCESS = 'POST_PROJECT_SUCCESS';
export function postProject(projectName, tasks) {
  return (dispatch) => {
    const newProject = {
      projectName,
      ownerId: getUser()._id,
      shortId: shortid.generate(),
      tasks: tasks || [],
    };

    dispatch({
      type: 'POST_PROJECT_REQUEST',
      project: newProject,
    });

    fetch(
      `${projectsUrl}`,
      {
        method: 'POST',
        body: JSON.stringify(newProject),
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const projectId = data.shortId;
        const databaseId = data._id;

        dispatch({
          type: 'POST_PROJECT_SUCCESS',
          projectId,
          databaseId,
        });

        localStorage.selectedProjectId = projectId;
      });
  };
}

export const POST_TASK_SUCCESS = 'POST_TASK_SUCCESS';
export function postTask(projectId, task) {
  return (dispatch) => {
    fetch(
      `${projectsUrl}/${projectId}`,
      {
        method: 'POST',
        body: JSON.stringify(task),
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const taskId = data.shortId;
        const databaseId = data._id;

        dispatch({
          type: 'POST_TASK_SUCCESS',
          projectId,
          taskId,
          databaseId,
        });
      });
  };
}

export const QUEUE_NEW_PROJECT = 'QUEUE_NEW_PROJECT';
export function queueNewProject(projectName) {
  return {
    type: 'QUEUE_NEW_PROJECT',
    projectName,
  };
}

export const UPDATE_TASK_REQUEST = 'UPDATE_TASK_REQUEST';
export function updateTask(project, task, toUpdate) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_TASK_REQUEST',
      projectId: project.shortId,
      taskId: task.shortId,
      toUpdate,
    });

    fetch(
      `${projectsUrl}/${project._id}/tasks/${task._id}`,
      {
        method: 'PUT',
        body: JSON.stringify(toUpdate),
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      });
  };
}

export const SET_ACTIVE_TASK = 'SET_ACTIVE_TASK';
export function setActiveTask() {
  return {
    type: 'SET_ACTIVE_TASK',
  };
}

export const SET_SELECTED_PROJECT = 'SET_SELECTED_PROJECT';
export function setSelectedProject(projectId) {
  return (dispatch) => {
    dispatch({
      type: 'SET_SELECTED_PROJECT',
      projectId,
    });

    localStorage.selectedProjectId = projectId;
  };
}

export const SET_SELECTED_TASK = 'SET_SELECTED_TASK';
export function setSelectedTask(taskId) {
  return (dispatch) => {
    dispatch({
      type: 'SET_SELECTED_TASK',
      taskId,
    });

    localStorage.selectedTaskId = taskId;
  };
}

export const START_RECORDING_TASK = 'START_RECORDING_TASK';
export function startRecordingTask(taskId) {
  return (dispatch) => {
    dispatch({
      type: 'START_RECORDING_TASK',
      taskId,
    });

    localStorage.selectedTaskId = taskId;
  };
}

export const STOP_RECORDING_TASKS = 'STOP_RECORDING_TASKS';
export function stopRecordingTasks() {
  return {
    type: 'STOP_RECORDING_TASKS',
  };
}

export const SWITCH_RECORDING_TASK = 'SWITCH_RECORDING_TASK';
export function switchRecordingTask(taskId) {
  return (dispatch) => {
    dispatch({
      type: 'SWITCH_RECORDING_TASK',
      taskId,
    });

    localStorage.selectedTaskId = taskId;
  };
}

export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';
export const TOGGLE_FETCHING = 'TOGGLE_FETCHING';
export function fetchProjects(jwt) {
  return (dispatch) => {
    if (!jwt) {
      console.warn('JWT not provided or undefined');
    }

    dispatch({ type: 'TOGGLE_FETCHING' });
    fetch(projectsUrl, {
      method: 'GET',
      headers: {
        ...getJWTAuthHeader(jwt),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return dispatch({
          type: 'FETCH_PROJECTS_SUCCESS',
          projects: data.projects,
        });
      });
  };
}

export const UPDATE_PROJECT_NAME_REQUEST = 'UPDATE_PROJECT_NAME_REQUEST ';
export function updateProjectName(project, newName) {
  return (dispatch) => {
    dispatch({
      type: 'UPDATE_PROJECT_NAME_REQUEST ',
      projectId: project.shortId,
      projectName: newName,
    });

    fetch(
      `${projectsUrl}/${project._id}`,
      {
        method: 'PUT',
        body: JSON.stringify({ projectName: newName }),
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      });
  };
}

const deleteSavedTasks = (dispatch, selectedProject, tasks) => {
  // delete tasks that do not already exist in the database
  // we assume that tasks without the database created id '_id' do not yet exist in the database
  tasks.filter(task => task.shouldDelete && task._id)
  // updateLocalState flag (third argument to delete task) should stay false here because we've
  // already made the local update via updateTasks()
    .forEach(task => dispatch(deleteTask(selectedProject, task, false)));
};

const postUnsavedTasks = (dispatch, selectedProjectDatabaseId, tasks) => {
  // post tasks that do not already exist in the database
  // we assume that tasks without the database created id '_id' do not yet exist in the database

  tasks.filter(task => !task._id)
    .forEach(task => dispatch(postTask(selectedProjectDatabaseId, task)));
};

export const UPDATE_TASKS = 'UPDATE_TASKS';
export function updateTasks(selectedProject, tasks) {
  return (dispatch) => {
    const tasksToSubmit = tasks.filter(task => !task.shouldDelete);

    dispatch({
      type: 'UPDATE_TASKS',
      projectId: selectedProject.shortId,
      newTasks: tasksToSubmit,
    });

    postUnsavedTasks(dispatch, selectedProject._id, tasksToSubmit);
    deleteSavedTasks(dispatch, selectedProject, tasks);
  };
}
