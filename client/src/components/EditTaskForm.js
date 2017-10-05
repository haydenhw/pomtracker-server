// refactor to fucntional/presentational Component. Pass submit handler from modal
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import { secondsToHMMSS, timeStringToSeconds } from '../helpers/time';
import { hasAnyValue, isDuplicate } from '../helpers/validate';
import { closeModal, confirmEditTask, updateTask } from '../actions/indexActions';

import Input from './Input';

let EditTaskForm = class extends Component {
  handleEditTaskSubmit({ taskName, newTime }) {
    const {
      clickedTaskId,
      closeModal,
      confirmEditTask,
      initialValues,
      selectedProject,
      selectedProjectId,
      selectedTask,
      taskNames,
      updateTask,
    } = this.props;
    const newTimeString = timeStringToSeconds(newTime);

    if (taskName !== initialValues.taskName && isDuplicate(taskName, taskNames)) {
      throw new SubmissionError({
        taskName: `A task with the name ${taskName} already exits`,
      });
    }

    if (!hasAnyValue(taskName)) {
      throw new SubmissionError({
        taskName: 'This field cannot be left blank',
      });
    }

    if (isNaN(newTimeString)) {
      throw new SubmissionError({
        newTime: 'Please enter a numberic time',
      });
    }

    const toUpdate = {
      taskName,
      recordedTime: newTimeString,
    };

    if (secondsToHMMSS(newTimeString) !== initialValues.newTime) {
      confirmEditTask({
        taskName,
        payload: [selectedProject, selectedTask, toUpdate],
        oldTime: initialValues.newTime,
        newTime: secondsToHMMSS(newTimeString),
      });
    } else if (taskName !== initialValues.taskName) {
      updateTask(selectedProject, selectedTask, toUpdate);
      closeModal();
    } else {
      closeModal();
    }
  }

  render() {
    const { closeModal, containerClass, handleSubmit, initialValues } = this.props;

    return (
      <div className={`${false ? '' : 'bounceInDown'}`}>
        <div className={`form-container ${containerClass || ''}`}>
          <h2 className="form-title">Edit Task</h2>
          <form className="form" onSubmit={handleSubmit(this.handleEditTaskSubmit.bind(this))}>
            <div className="form-field-wrapper">
              <label>Task Name</label>
              <Field
                name="taskName"
                component={Input}
                shouldAutoFocus
                type="text"
              />
            </div>
            <div className="form-field-wrapper">
              <label>Logged Time: {initialValues.recordedTime}</label>
              <Field
                name="newTime"
                component={Input}
                type="text"
              />
            </div>
          </form>
        </div>
        <button className="fade-in-medium-delay outline-button modal-button-bottom-right" onClick={handleSubmit(this.handleEditTaskSubmit.bind(this))} type="submit">Submit</button>
      </div>
    );
  }
};
// Decorate with reduxForm(). It will read the initialValues prop provided by connect()
EditTaskForm = reduxForm({
  form: 'EditTaskForm', // a unique identifier for this form
})(EditTaskForm);

const mapStateToProps = (state, ownProps) => {
  const { clickedTaskId, selectedProjectId, projects } = state;

  const selectedProject = projects.items.find((project) => { return project.shortId === selectedProjectId; });
  const selectedTask = projects.items.concatMap((project) => { return project.tasks; }).find((task) => { return clickedTaskId === task.shortId; });
  const taskNames = selectedProject.tasks.map((task) => { return task.taskName; });

  return ({
    clickedTaskId,
    selectedProjectId,
    selectedProject,
    selectedTask,
    taskNames,
    initialValues: {
      taskName: selectedTask.taskName,
      newTime: secondsToHMMSS(selectedTask.recordedTime),
    },
  });
};

EditTaskForm = connect(mapStateToProps, {
  closeModal,
  confirmEditTask,
  updateTask,
})(EditTaskForm);

export default EditTaskForm;

EditTaskForm.propTypes = {
  clickedTaskId: PropTypes.string.isRequired,
  closeModal: PropTypes.func.isRequired,
  confirmEditTask: PropTypes.func.isRequired,
  containerClass: PropTypes.string,
  handleSubmit: PropTypes.string,
  initialValues: PropTypes.string.isRequired,
  selectedProject: PropTypes.object.isRequired,
  selectedProjectId: PropTypes.string.isRequired,
  selectedTask: PropTypes.object.isRequired,
  taskNames: PropTypes.array.isRequired,
  updateTask: PropTypes.string.isRequired,
} 
