import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal, deleteTask, toggleModal } from '../actions/indexActions'; 
import Confirm from '../components/Confirm';

const deleteTaskAndCloseModal = (deleteTaskParams, deleteTask, closeModal) => () => {
  deleteTask(...deleteTaskParams);
  closeModal();
}

const getDangerText = (taskName) => {
  return (
    <span>Are you sure you want to delete task <span className="grey-title-text">{taskName}</span> ? </span>
  );
}

function ConfirmDeleteTask(props) {
  const { closeModal, deleteTask, payload, taskName, toggleModal } = props;
  
  return(
    <Confirm 
      onDangerClick={deleteTaskAndCloseModal(payload, deleteTask, closeModal)}
      onDangerText={getDangerText(taskName)}
      onCancel={toggleModal}
      title={<h2>Confirm Delete</h2>}
    />
  );
}

export default connect(null, { closeModal, deleteTask, toggleModal })(ConfirmDeleteTask);

ConfirmDeleteTask.propTypes = {
  
}