import * as actions from '../actions/indexActions';

import { modalType, renderFormModal } from '../src-config/devSettings';

const defaultState = {
  modalType,
  isOnboardingActive: false,
  isModalActive: renderFormModal,
  isModalClosing: false,
  modalProps: null,
};

export default function modal(state = defaultState, action) {
  switch (action.type) {
    case actions.ADD_MODAL_CLOSING_CLASS:
      return {
        ...state,
        isModalClosing: true,
      };
    case actions.CHANGE_MODAL_TYPE:
      return {
        ...state,
        modalType: action.modalType,
      };
    case actions.CLOSE_MODAL:
      return {
        ...state,
        isModalActive: false,
        isModalClosing: false,
        isOnboardingActive: false,
      };
    case actions.CONFIRM_DELETE_PROJECT:
      return {
        ...state,
        isModalActive: true,
        modalType: 'CONFIRM_DELETE_PROJECT',
        modalProps: action.modalProps,
      };
    case actions.CONFIRM_DELETE_TASK:
      return {
        ...state,
        isModalActive: true,
        modalType: 'CONFIRM_DELETE_TASK',
        modalProps: action.modalProps,
      };
    case actions.CONFIRM_EDIT_TASK:
      return {
        ...state,
        isModalActive: true,
        modalType: 'CONFIRM_EDIT_TASK',
        modalProps: action.modalProps,
      };
    case actions.TOGGLE_ADD_TASKS_FORM:
      return {
        ...state,
        isModalActive: !state.isModalActive,
        modalType: 'ADD_TASKS',
      };
    case actions.TOGGLE_EDIT_TASK_FORM:
      return {
        ...state,
        isModalActive: true,
        modalType: 'EDIT_TASK',
      };
    case actions.TOGGLE_CONFIG:
      return {
        ...state,
        isModalActive: true,
        modalType: 'CONFIG',
      };
    case actions.TOGGLE_ONBOARD_MODE:
      return {
        ...state,
        isModalActive: !state.isModalActive,
        isModalClosing: false,
        isOnboardingActive: !state.isOnboardingActive,
      };
    case actions.TOGGLE_PROJECT_NAG_MODAL:
      return {
        ...state,
        isModalActive: true,
        modalProps: action.modalProps,
        modalType: 'PROJECT_NAG',
      };
    case actions.UPDATE_MODAL_PROPS:
      return {
        ...state,
        modalProps: action.modalProps,
      };
    default:
      return state;
  }
}
