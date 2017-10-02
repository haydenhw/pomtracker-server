import { hashHistory } from 'react-router';

const url = 'testRouter';

export const FETCH_TEST_DATA_SUCCESS = 'FETCH_TEST_DATA_SUCCESS';
export const fetchTestDataSuccess = (testData) => {
  return {
    type: 'FETCH_TEST_DATA_SUCCESS',
    testData,
  };
};

export function fetchTestData() {
  return (dispatch) => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        dispatch(fetchTestDataSuccess(data));
      })
      .catch((err) => {
        console.error(err);
      });
  };
}

export const FECTCH_PROJECT_BY_ID_SUCCESS = 'FECTCH_PROJECT_BY_ID_SUCCESS';
export const fetchProjectByIdSuccess = (project) => {
  return {
    type: 'FECTCH_PROJECT_BY_ID_SUCCESS',
    project,
  };
};

export function fetchProjectById(projectId, currentRoute) {
  const projectUrl = `${projectsUrl}/${projectId}`;
  return (dispatch) => {
    fetch(projectUrl)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        dispatch(fetchProjectByIdSuccess(data));
        const designRoute = `/design/${projectId}`;

        if (currentRoute !== designRoute) {
          hashHistory.push(designRoute);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };
}

export const POST_NEW_PROJECT_SUCCESS = 'POST_NEW_PROJECT_SUCCESS';
export const postNewProjectSuccess = (modules) => {
  return {
    type: 'POST_NEW_PROJECT_SUCCESS',
    modules,
  };
};

export function postNewProject(newProject) {
  return (dispatch) => {
    fetch(
      projectsUrl,
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
        const projectId = data._id;
        console.log('New project saved');
        dispatch(fetchProjectById(projectId));
      })
      .catch((err) => {
        console.error(err);
      });
  };
}

export const UPDATE_PROJECT_SUCCESS = 'UPDATE_PROJECT_SUCCESS';
export const updateProjectNameSuccess = (modules) => {
  return {
    type: 'UPDATE_PROJECT_SUCCESS',
    modules,
  };
};

export function updateProjectName(data, projectId) {
  return (dispatch) => {
    fetch(projectsUrl + projectId, {
      method: 'put',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        alert(JSON.stringify(data));
      })
      .catch((err) => {
        console.error(err);
      });
  };
}

export const DELETE_PROJECT_SUCCESS = 'DELETE_PROJECT_SUCCESS';
export const deleteProjectSuccess = (projectId, projects) => {
  return {
    type: 'DELETE_PROJECT_SUCCESS',
    projectId,
  };
};

export function deleteProject(projectId, projects) {
  const url = `${projectsUrl}/${projectId}`;
  return (dispatch) => {
    fetch(
      url,
      {
        method: 'DELETE',
        headers: new Headers({
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }),
      })
      .then((res) => {
        console.log('delete successful');
        dispatch(fetchProjects());
      })
      .catch((err) => {
        console.error(err);
      });
  };
}
