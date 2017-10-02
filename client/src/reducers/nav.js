// Not currently in use!!

import * as actions from '../actions/indexActions';

const defaultState = {
  activeLink: 'TIMER',
};

export function nav(state = defaultState, action) {
  switch (action.type) {
    case actions.CHANGE_ACTIVE_LINK:
      return {
        ...state,
        activeLink: action.activeLink,
      };

    default:
      return state;
  }
}
