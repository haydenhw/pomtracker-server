// refactor to functional component
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { reduxForm } from 'redux-form';
import { submit, SubmissionError } from 'redux-form';

import AddTasksFormContainer from '../containers/AddTasksFormContainer';

export default class ProjectTaskForm extends Component {
  render() {
    const {
      children,
      handleSubmit,
      handleCancel,
      label,
      selectedProjectName,
      showTasksForSelectedProject,
      title,
    } = this.props;
    
    return (
      <div className="form-page fullscreen-container">
        <div className="form-container">
          <h2 className="form-title">{title}<span className="grey-title-text">{selectedProjectName}</span></h2>
          {label && <label>{label}</label>}
          {children}
          <AddTasksFormContainer
            shouldDisableFocusOnMount
            shouldRenderSubmitButton={false}
            showTasksForSelectedProject={showTasksForSelectedProject}
          />
          <div className="form-page-button-group">
            <button className="form-page-button outline-button" onClick={handleCancel}>Cancel</button>
            <button className="form-page-button outline-button" onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    );
  }
}

ProjectTaskForm.propTypes = {
  children: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
  label: PropTypes.string,
  selectedProjectName: PropTypes.string,
  shouldDisableTaskFormFocus: PropTypes.bool,
  showTasksForSelectedProject: PropTypes.bool,
  title: PropTypes.string.isRequired,
};
