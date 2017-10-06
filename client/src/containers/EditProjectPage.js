import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { SubmissionError } from 'redux-form';
import { addTask, deleteTask, setSelectedProject, remoteSubmit, updateProjectName, updateTasks } from '../actions/indexActions';

import { hasAnyValue } from '../helpers/validate';
import { routeToProjectsPage } from '../helpers/route';

import SingleInputForm from '../components/SingleInputForm';
import ProjectTaskForm from './ProjectTaskForm';

class EditProjectPage extends Component {
  static defaultProps = {
    projects: [],
  }

  constructor(props) {
    super(props);

    const { selectedProject } = props;

    this.handleEditProjectSubmit = this.handleEditProjectSubmit(selectedProject);
    this.handleRemoteSubmit = this.handleRemoteSubmit.bind(this);
  }

  componentWillMount() {
    const { remoteSubmit } = this.props;

    remoteSubmit(null);
  }

  componentDidUpdate(prevProps) {
    if (this.props.remoteSubmitForm === 'ADD_TASKS' && prevProps.remoteSubmitForm === 'ADD_TASKS') {
      routeToProjectsPage();
    }
  }

  handleEditProjectSubmit = project => ({ singleInput: projectName }) => {
    const { updateProjectName, remoteSubmit, updateTasks, tasks } = this.props;
    
    if (!hasAnyValue(projectName)) {
      remoteSubmit(null);
      
      throw new SubmissionError({
        singleInput: 'Project name is required' 
      })
    }
    
    updateProjectName(project, projectName);
    updateTasks(project, tasks);
    remoteSubmit(null);
    routeToProjectsPage();
  } 

  handleRemoteSubmit() {
    const { remoteSubmit } = this.props;

    remoteSubmit('ADD_PROJECT');
  }

  render() {
    const { remoteSubmitForm, selectedProject } = this.props;

    if (!selectedProject) {
      return null;
    }

    return (
      <ProjectTaskForm
        handleCancel={routeToProjectsPage}
        handleSubmit={this.handleRemoteSubmit}
        label="Project Name"
        shouldDisableTaskFormFocus
        showTasksForSelectedProject
        title="Edit Project"
      >
        <SingleInputForm
          formName={'projectName'}
          initialValues={{ singleInput: selectedProject.projectName }}
          placeholder={'Project Name'}
          shouldRenderSubmitButton={false}
          onTargetUpdate={this.handleEditProjectSubmit}
          targetPropKey="remoteSubmitForm"
          targetValue="ADD_PROJECT"
          form={'project form'}
        />
      </ProjectTaskForm>
    );
  }
}
const mapStateToProps = (state) => {
  const { customForm, selectedProjectId, projects } = state;
  const { remoteSubmitForm, taskForm } = customForm;
  const { tasks } = taskForm;

  const selectedProject = state.projects.items.length > 0 && selectedProjectId
    ? projects.items.find((project) => { return project.shortId === selectedProjectId; })
    : null;

  return {
    projects,
    remoteSubmitForm,
    selectedProjectId,
    selectedProject,
    tasks,
  };
};

export default connect(mapStateToProps, {
  addTask,
  deleteTask,
  setSelectedProject,
  remoteSubmit,
  updateProjectName,
  updateTasks,
})(EditProjectPage);

EditProjectPage.propTypes = {
  projects: PropTypes.object.isRequired,
  remoteSubmit: PropTypes.func.isRequired,
  remoteSubmitForm: PropTypes.func,
  selectedProject: PropTypes.object.isRequired,
  tasks: PropTypes.array.isRequired,
  updateProjectName: PropTypes.func.isRequired,
  updateTasks: PropTypes.func.isRequired,
};
