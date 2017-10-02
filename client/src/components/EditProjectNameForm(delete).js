import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { hashHistory } from 'react-router';

import { updateProjectName } from '../actions/indexActions';

const renderField = ({ input, label, type, meta: { touched, error } }) => {return (
  <div>
    <label />
    <input
      {...input} 
      autoFocus 
      autoComplete="off"
      className="form-input fullscreen-input add-project-input" 
      placeholder="Project name" 
      type={type} 
    />
    {touched && error && <div className="form-error">{error}</div>}
  </div>
)}

let EditProjectForm = class extends Component {
  componentWillMount() {
    const { project } = this.props;

    if (!project) {
      hashHistory.push('/projects');
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.shouldSubmit !== this.props.shouldSubmit) {
      const { handleSubmit, handleEditProjectSubmit, project, updateProjectName } = this.props;
      handleSubmit(handleEditProjectSubmit(project, updateProjectName))();
    }
  }

  handleEditProjectSubmit = (project, updateProjectName) => {return { projectName } =>  (
    updateProjectName(project, projectName)
  )};

  render() {
    const { handleSubmit, handleEditProjectSubmit, project, updateProjectName } = this.props;

    return (
      <form onSubmit={handleSubmit(handleEditProjectSubmit(project, updateProjectName))}>
        <div>
          <div>
            <Field
              name="projectName"
              component={renderField}
              type="text"
              placeholder="Project Name"
            />
          </div>
        </div>
      </form>
    );
  }
};

const mapStateToProps = (state) => {
  const { selectedProjectId, projects } = state;

  const selectedProject = projects.items.find(project => {return project.shortId === selectedProjectId});
  const projectName = (projects.items.length > 0 && selectedProjectId) && selectedProject.projectName;

  return ({
    selectedProjectId,
    initialValues: { projectName },
    project: selectedProject,
  });
};

EditProjectForm = reduxForm({
  form: 'EditProjectForm', // a unique identifier for this form
})(EditProjectForm);

EditProjectForm = connect(mapStateToProps, { updateProjectName })(EditProjectForm);

export default EditProjectForm;
