import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  deleteTask,
  decrementTimer,
  changeActiveContextMenu,
  confirmDeleteTask,
  fetchProjects,
  setSelectedProject,
  setTempTasks,
  toggleAddTasksForm,
  toggleConfig,
  toggleEditTaskForm,
  toggleOnboardMode,
  toggleTimer,
} from '../actions/indexActions';

import TimeTracker from './TimeTracker';

class TimeTrackerPage extends Component {
  shouldComponentUpdate(nextProps) {
    const { isModalActive } = this.props;

    if (this.props.selectedProjectId && (nextProps.selectedProjectId !== this.props.selectedProjectId) && isModalActive) {
      return false;
    }

    return true;
  }

  render() {
    const {
      hasFetched,
      selectedProject,
      selectedTasks,
    } = this.props;

    if (!hasFetched) {
      return <div className="loader">Loading...</div>;
    }
    return (
      <TimeTracker
        selectedProject={selectedProject || null}
        tasks={selectedTasks || []}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { modal, projects, timer, selectedProjectId } = state;
  const { hasFetched, isFetching } = projects;
  const { isModalActive, isModalClosing, isOnboardingActive } = modal;
  const { isTimerActive } = timer;

  const selectedProject = projects.items.find((project) => { return project.shortId === selectedProjectId; });
  const selectedTasks = selectedProject && selectedProject.tasks;

  return {
    hasFetched,
    isFetching,
    isModalActive,
    isModalClosing,
    isOnboardingActive,
    isTimerActive,
    selectedProject,
    selectedTasks,
    projects: projects.items,
  };
};

export default connect(mapStateToProps, {
  changeActiveContextMenu,
  confirmDeleteTask,
  decrementTimer,
  deleteTask,
  fetchProjects,
  setSelectedProject,
  setTempTasks,
  toggleAddTasksForm,
  toggleConfig,
  toggleEditTaskForm,
  toggleOnboardMode,
  toggleTimer,
})(TimeTrackerPage);

TimeTrackerPage.propTypes = {
  changeActiveContextMenu: PropTypes.func.isRequired,
  confirmDeleteTask: PropTypes.func.isRequired,
  decrementTimer: PropTypes.func.isRequired,
  deleteTask: PropTypes.func.isRequired,
  fetchProjects: PropTypes.func.isRequired,
  hasFetched: PropTypes.bool,
  isFetching: PropTypes.bool,
  isModalActive: PropTypes.bool,
  isModalActive: PropTypes.bool,
  isModalClosing: PropTypes.bool,
  isOnboardingActive: PropTypes.bool,
  isTimerActive: PropTypes.bool,
  projects: PropTypes.array,
  selectedProject: PropTypes.object,
  selectedProjectId: PropTypes.string,
  selectedTasks: PropTypes.array,
  setSelectedProject: PropTypes.func.isRequired,
  setTempTasks: PropTypes.func.isRequired,
  toggleAddTasksForm: PropTypes.func.isRequired,
  toggleConfig: PropTypes.func.isRequired,
  toggleEditTaskForm: PropTypes.func.isRequired,
  toggleOnboardMode: PropTypes.func.isRequired,
  toggleTimer: PropTypes.func.isRequired,
};

