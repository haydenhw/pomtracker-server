import shortid from 'shortid';

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
      `projects/${project._id}`,
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
export function deleteTask(project, task, shouldUpdateLocalState) {
  return (dispatch) => {
    if (shouldUpdateLocalState) {
      dispatch({
        type: 'DELETE_TASK_REQUEST',
        projectId: project.shortId,
        taskId: task.shortId,
      });
    }

    fetch(
      `projects/${project._id}/tasks/${task._id}`,
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
      shortId: shortid.generate(),
      tasks: tasks || [],
    };

    dispatch({
      type: 'POST_PROJECT_REQUEST',
      project: newProject,
    });

    fetch(
      'projects',
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
      `projects/${projectId}`,
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
      `projects/${project._id}/tasks/${task._id}`,
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
export function setActiveTask(taskId) {
  return (dispatch) => {
    dispatch({
      type: 'SET_ACTIVE_TASK',
      taskId,
    });
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

export const FETCH_PROJECTS_SUCCESS = 'FETCH_PROJECTS_SUCCESS';
export const TOGGLE_FETCHING = 'TOGGLE_FETCHING';
export function fetchProjects() {
  return (dispatch) => {
    dispatch({ type: 'TOGGLE_FETCHING' });

    fetch('projects')
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
      `projects/${project._id}`,
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
  // we assume that taks without the database created id '_id' do not yet exist in the database

  tasks.filter(task => task.shouldDelete && task._id)
    .forEach(task => dispatch(deleteTask(selectedProject, task)));
};

const postUnsavedTasks = (dispatch, selectedProjectDatabaseId, tasks) => {
  // post tasks that do not already exist in the database
  // we assume that taks without the database created id '_id' do not yet exist in the database

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
