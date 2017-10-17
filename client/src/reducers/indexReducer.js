import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import { clickedTaskId } from './clickedTaskId';
import { config } from './config';
import { customForm } from './customForm';
import { editMenu } from './editMenu';
import { modal } from './modal';
import { projects } from './projects';
import { selectedProjectId } from './selectedProjectId';
import { timer } from './timer';

export default combineReducers({
  clickedTaskId,
  config,
  customForm,
  editMenu,
  modal,
  projects,
  // selectedProjectId,
  timer,
  form: formReducer,
});
