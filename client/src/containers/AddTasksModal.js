import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changeModalType } from '../actions/indexActions';

import AddTasksFormContainer from './AddTasksFormContainer';

function AddTasksModal(props) {
  const { selectedProjectName } = props;

  return (
    <AddTasksFormContainer
      title='Add tasks for project '
      titleName={selectedProjectName}
    />
  );
}

const mapStateToProps = (state) => {
  const { projects } = state;
  const { selectedProjectId } = projects;

  const selectedProjectName = projects.items.length > 0
    ? projects.items.find((project) => { return project.shortId === selectedProjectId; }).projectName
    : null;

  return {
    selectedProjectName,
  };
};

export default connect(mapStateToProps, { changeModalType })(AddTasksModal);

AddTasksModal.propTypes = {
  selectedProjectName: PropTypes.string.isRequired,
};
