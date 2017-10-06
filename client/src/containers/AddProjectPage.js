import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';

import { postProject, remoteSubmit } from '../actions/indexActions';
import { hasAnyValue, isDuplicate } from '../helpers/validate';
import { routeToProjectsPage } from '../helpers/route';

import ProjectTaskForm from './ProjectTaskForm';
import SingleInputForm from '../components/SingleInputForm';

let AddProjectPage = class extends Component {
  handleNewProjectSubmit({ singleInput: projectName }) {
    const { newTasks, postProject, projects, remoteSubmit } = this.props;
    const projectNames = projects.items.map((project) => { return project.projectName; });

    if (!hasAnyValue(projectName)) {
      remoteSubmit(null);

      throw new SubmissionError({
        singleInput: 'Project name is required',
      });
    }

    if (isDuplicate(projectName, projectNames)) {
      throw new SubmissionError({
        singleInput: `A project with the name '${projectName}' already exists`,
      });
    }

    postProject(projectName, newTasks);
    remoteSubmit(null);
    routeToProjectsPage();
  }

  handleRemoteSubmit() {
    const { remoteSubmit } = this.props;

    remoteSubmit('ADD_PROJECT');
  }

  render() {
    const { remoteSubmitForm } = this.props;

    return (
      <ProjectTaskForm
        handleSubmit={this.handleRemoteSubmit.bind(this)}
        handleCancel={routeToProjectsPage}
        label="Project Name"
        title="New Project"
      >
        <SingleInputForm
          formName={'projectName'}
          placeholder={'Project Name'}
          remoteSubmitForm={remoteSubmitForm}
          shouldRenderSubmitButton={false}
          onTargetUpdate={this.handleNewProjectSubmit.bind(this)}
          targetValue="ADD_PROJECT"
          targetPropKey="remoteSubmitForm"
        />
      </ProjectTaskForm>
    );
  }
};

const mapStateToProps = (state) => {
  const { customForm, projects } = state;
  const { remoteSubmitForm, taskForm } = customForm;
  const { tasks: newTasks } = taskForm;

  return {
    newTasks,
    projects,
  };
};

export default AddProjectPage = connect(mapStateToProps, { postProject, remoteSubmit })(AddProjectPage);

AddProjectPage.propTypes = {
  newTasks: PropTypes.array,
  postProject: PropTypes.func,
  projects: PropTypes.array,
  remoteSubmit: PropTypes.func,
  remoteSubmitForm: PropTypes.func
};
