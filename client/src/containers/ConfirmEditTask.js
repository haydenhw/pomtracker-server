import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal, updateTask, toggleEditTaskForm } from '../actions/indexActions';

import Confirm from '../components/Confirm';

const updateTaskAndCloseModal = (updateTaskParams, updateTask, closeModal) => {
  return () => {
    updateTask(...updateTaskParams);
    closeModal();
  };
};

const getDangerMessage = (oldTime, newTime) => {
  return (
    <span>
      Are you sure you want to change the logged time from
      <span className="confirm-time">{oldTime}</span>
       to
      <span className="confirm-time">{newTime}</span>
       ?
    </span>
  );
};

function ConfirmEditTask(props) {
  const { closeModal, oldTime, newTime, payload, updateTask, taskName } = props;
  return (
    <Confirm
      onCancel={closeModal}
      onDangerClick={updateTaskAndCloseModal(payload, updateTask, closeModal)}
      dangerText={getDangerMessage(oldTime, newTime)}
      title={<h2 className="form-title">Confirm time change for task <span className="grey-title-text">{taskName}</span></h2>}
    />
  );
}

export default connect(null, { closeModal, updateTask, toggleEditTaskForm })(ConfirmEditTask);

ConfirmEditTask.propTypes = {
  closeModal: PropTypes.func.isRequired,
  oldTime: PropTypes.number.isRequired,
  newTime: PropTypes.number.isRequired,
  payload: PropTypes.object.isRequired,
  updateTask: PropTypes.func.isRequired,
  taskName: PropTypes.string.isRequired,
  toggleEditTaskForm: PropTypes.func.isRequired,
};
