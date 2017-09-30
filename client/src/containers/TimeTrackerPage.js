import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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
  toggleTimer
} from '../actions/indexActions';

import TimeTracker from './TimeTracker';

class TimeTrackerPage extends Component {
  shouldComponentUpdate(nextProps) {
    const { isModalActive, selectedProjectId } = this.props;
    
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
      return <div className="loader">Loading...</div>
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

const mapStateToProps = state => {
  const {  modal, projects, timer, selectedProjectId } = state;
  const { hasFetched, isFetching } = projects;
  const { isModalActive, isModalClosing, isOnboardingActive } = modal;
  const { isTimerActive } = timer;
  
  const selectedProject = projects.items.find(project => project.shortId === selectedProjectId);
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
    projects: projects.items
  }
}

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
  toggleTimer
})(TimeTrackerPage);

TimeTrackerPage.propTypes = {
  projects: PropTypes.array
}
