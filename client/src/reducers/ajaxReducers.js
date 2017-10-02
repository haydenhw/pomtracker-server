import * as actions from '../actions/indexActions';

export const testData = (state = [], action) => {
  switch (action.type) {
    case 'TEST':
      console.log('hola from redurcer');
      return action.testData;
  }
  return state;
};

export const currentProjectInfo = (state = {}, action) => {
  if (action.type === actions.FECTCH_PROJECT_BY_ID_SUCCESS) {
    return {
      name: action.project.name,
      id: action.project._id,
    };
  }

  return state;
};

/*
export const projectList = (state = [], action) => {
  switch(action.type){
    case(actions.FETCH_PROJECTS_SUCCESS):
      return action.projects;
      break;
    case(actions.DELETE_PROJECT_SUCCESS):
      
  }
} */
