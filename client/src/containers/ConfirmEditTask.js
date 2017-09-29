import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { closeModal, updateTask, toggleEditTaskForm } from '../actions/indexActions'; 

import Confirm from '../components/Confirm';

const updateTaskAndCloseModal = (updateTaskParams, updateTask, closeModal) => () => {
  updateTask(...updateTaskParams);
  closeModal();
}

const getDangerMessage = (oldTime, newTime) => { 
  return (
    <span> 
      Are you sure you want to change the logged time from
      <span className="confirm-time"> {oldTime} </span>
       to  
      <span className="confirm-time"> {newTime} </span>
       ?
    </span>
  ); 
}

function ConfirmEditTask(props) {
  const { closeModal, oldTime, newTime, payload, updateTask, taskName, toggleEditTaskForm } = props;
  return(
    <Confirm 
      onDangerClick={updateTaskAndCloseModal(payload, updateTask, closeModal)}
      onDangerText={getDangerMessage(oldTime, newTime)}
      onCancel={closeModal}
      title={<h2 className="form-title">Confirm time change for task <span className="grey-title-text">{taskName}</span></h2>}
    />
  );
}

export default connect(null, { closeModal, updateTask, toggleEditTaskForm })(ConfirmEditTask);

ConfirmEditTask.propTypes = {
  
}