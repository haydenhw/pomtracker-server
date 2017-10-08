import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { changeModalType, postProject } from '../actions/indexActions';
import { hasAnyValue, isDuplicate } from '../helpers/validate';

import AddOrEditProjectForm from '../components/AddOrEditProjectForm';

class AddProjectModal extends Component {
  handleAddProject({ singleInput: projectName }) {
    const { changeModalType, postProject, projects } = this.props;

    const projectNames = projects.map(project => project.projectName);

    if (!hasAnyValue(projectName)) {
      throw new SubmissionError({
        singleInput: 'Project name is required',
      });
    }

    if (isDuplicate(projectName, projectNames)) {
      throw new SubmissionError({
        singleInput: `A project with the name '${projectName}' already exists`,
      });
    }

    postProject(projectName);
    changeModalType('ADD_TASKS');
  }

  render() {
    const { lastSavedProjectName } = this.props;

    return (
      <AddOrEditProjectForm
        childContainerClass="form-container onboarding-form"
        fieldAnimationName="bounceInDown-second"
        formName="projectName"
        handleFormSubmit={this.handleAddProject.bind(this)}
        isModalActive
        isOnlyInput
        parentContainerClass="fullscreen-container"
        placeholder="Project Name"
        shouldRenderSubmitButton
        title="Add a project name"
        titleAnimationName="bounceInDown"
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { projects } = state;

  const lastSavedProjectName = projects.length > 0
    ? projects.items[projects.items.length - 1].projectName
    : null;

  return {
    lastSavedProjectName,
    projects: projects.items,
  };
};

export default connect(mapStateToProps, { changeModalType, postProject })(AddProjectModal);

AddProjectModal.propTypes = {
  changeModalType: PropTypes.func.isRequired,
  lastSavedProjectName: PropTypes.string,
  postProject: PropTypes.func.isRequired,
  projects: PropTypes.array.isRequired,
};
