import * as actions from '../actions/indexActions';

const defaultState = {
  activeParentId: null,
};

export function editMenu(state = defaultState, action) {
  switch (action.type) {
    case actions.CHANGE_ACTIVE_EDIT_MENU:
      return {
        activeParentId: action.parentId,
      };
    default:
      return state;
  }
}
