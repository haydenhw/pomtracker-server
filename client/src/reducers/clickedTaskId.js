import * as actions from '../actions/indexActions';

export function clickedTaskId(state = null, action) {
  switch (action.type) {
    case actions.TOGGLE_EDIT_TASK_FORM:
      return action.taskId;
    default:
      return state;
  }
}
