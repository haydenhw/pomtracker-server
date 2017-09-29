export const TOGGLE_MODAL = 'TOGGLE_MODAL';
export const toggleModal = () => ({
  type: 'TOGGLE_MODAL',
});

export const ADD_MODAL_CLOSING_CLASS = 'ADD_MODAL_CLOSING_CLASS';
export const addModalClosingClass = () => ({
  type: 'ADD_MODAL_CLOSING_CLASS',
});

export const closeModal = () => {
  return (dispatch) => {
    dispatch(addModalClosingClass());
    
    setTimeout(() => dispatch(toggleModal()), 1500);
  } 
} 

export const TOGGLE_CONFIG = 'TOGGLE_CONFIG';
export const toggleConfig = () => ({
  type: 'TOGGLE_CONFIG',
});

export const TOGGLE_ONBOARD_MODE = 'TOGGLE_ONBOARD_MODE';
export const toggleOnboardMode = () => {
  return (dispatch, getState) => {
    
    if (!getState().modal.isOnboardingActive) {
      return dispatch({ type: 'TOGGLE_ONBOARD_MODE' });
    }
    
    dispatch(addModalClosingClass());
    
    setTimeout(() => dispatch({ type: 'TOGGLE_ONBOARD_MODE' }), 1500);
  }
}
export const TOGGLE_ADD_TASKS_FORM = 'TOGGLE_ADD_TASKS_FORM';
export const toggleAddTasksForm = () => ({
  type: 'TOGGLE_ADD_TASKS_FORM',
});

export const TOGGLE_EDIT_TASK_FORM = 'TOGGLE_EDIT_TASK_FORM';
export const toggleEditTaskForm = (taskId) => ({
  type: 'TOGGLE_EDIT_TASK_FORM',
  taskId
});

export const TOGGLE_PROJECT_NAG_MODAL = 'TOGGLE_PROJECT_NAG_MODAL';
export const toggleProjectNagModal = (modalProps) => ({
  type: 'TOGGLE_PROJECT_NAG_MODAL',
  modalProps
});

export const CONFIRM_EDIT_TASK = 'CONFIRM_EDIT_TASK';
export const confirmEditTask = (modalProps) => ({
  type: 'CONFIRM_EDIT_TASK',
  modalProps
});

export const CONFIRM_DELETE_TASK = 'CONFIRM_DELETE_TASK';
export const confrimDeleteTask= (modalProps) => ({
  type: 'CONFIRM_DELETE_TASK',
  modalProps
});

export const CONFIRM_DELETE_PROJECT = 'CONFIRM_DELETE_PROJECT';
export const confrimDeleteProject = modalProps => ({
  type: 'CONFIRM_DELETE_PROJECT',
  modalProps,
  modalType: 'CONFIRM',
});

export const CHANGE_MODAL_TYPE = 'CHANGE_MODAL_TYPE';
export const changeModalType = modalType => ({
  type: 'CHANGE_MODAL_TYPE',
  modalType,
});

export const UPDATE_MODAL_PROPS = 'UPDATE_MODAL_PROPS';
export const updateModalProps = modalProps => ({
  type: 'UPDATE_MODAL_PROPS',
  modalProps,
});
