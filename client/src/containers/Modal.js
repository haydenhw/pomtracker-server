import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { closeModal } from '../actions/indexActions';

import RootModal from '../components/ModalRoot';
import AddProjectModal from './AddProjectModal';
import AddTasksModal from './AddTasksModal';
import ConfigModal from './ConfigModal';
import ConfirmEditTask from './ConfirmEditTask';
import ConfirmDeleteProject from './ConfirmDeleteProject';
import ConfirmDeleteTask from './ConfirmDeleteTask';
import EditTaskModal from './EditTaskModal';
import ProjectNagModal from './ProjectNagModal';
import WelcomeModalContainer from './WelcomeModalContainer';

function Modal(props) {
  const MODAL_COMPONENTS = {
    ADD_PROJECT: AddProjectModal,
    ADD_TASKS: AddTasksModal,
    CONFIG: ConfigModal,
    CONFIRM_EDIT_TASK: ConfirmEditTask,
    CONFIRM_DELETE_PROJECT: ConfirmDeleteProject,
    CONFIRM_DELETE_TASK: ConfirmDeleteTask,
    EDIT_TASK: EditTaskModal,
    PROJECT_NAG: ProjectNagModal,
    WELCOME: WelcomeModalContainer,
  };

  const {
    isModalActive,
    isCloseButtonActive,
    modalClass,
    modalProps,
    modalType,
    rootModalClass,
    style,
    closeModal,
  } = props;

  if (!isModalActive) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[modalType];
  return (
    <RootModal className={rootModalClass}>
      <div className={`modal ${modalClass}`} style={style}>
        {isCloseButtonActive !== false &&
        <span className="modal-close" onClick={closeModal} role="button">&times;</span>
        }
        <SpecificModal {...modalProps} />
      </div>
    </RootModal>
  );
}

const mapStateToProps = (state) => {
  const { modal } = state;
  const { isModalActive, modalProps, modalType } = modal;

  return {
    isModalActive,
    modalProps,
    modalType,
  };
};

export default connect(mapStateToProps, { closeModal })(Modal);

Modal.propTypes = {

};
