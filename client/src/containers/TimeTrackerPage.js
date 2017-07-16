import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  deleteTask,
  decrementTimer,
  changeActiveEditMenu,
  fetchProjects,
  setSelectedProject,
  toggleAddTasksForm,
  toggleEditTaskForm
} from '../actions/indexActions';

import TimeTracker from './TimeTracker';

class TimeTrackerPage extends Component {
  render() {
    const { 
      changeActiveEditMenu,
      decrementTimer,
      deleteTask,
      hasFetched,
      isFetching,
      isModalActive,
      isTimerActive,
      projects,
      selectedProjectId,
      setSelectedProject,
      toggleAddTasksForm, 
      toggleEditTaskForm
    } = this.props;
  
    if (!hasFetched) {
      return <div className="loader">Loading...</div>
    }
    
    const selectedProjectIndex = selectedProjectId && projects.findIndex(project => project.shortId === selectedProjectId);
    const selectedProject = (selectedProjectIndex !== null && !isNaN(selectedProjectIndex)) && projects[selectedProjectIndex];
    const selectedTasks = selectedProject && selectedProject.tasks;
    
    return (
      <div className="time-tracker-page-container">
        <TimeTracker
          changeActiveEditMenu={changeActiveEditMenu}
          decrementTimer={decrementTimer}
          deleteTask={deleteTask}
          projects={projects}
          hasFetched={hasFetched}
          isFetching={isFetching}
          isModalActive={isModalActive}
          isTimerActive={isTimerActive}
          selectedProject={selectedProject || null}
          setSelectedProject={setSelectedProject}
          tasks={selectedTasks || []}
          toggleAddTasksForm={toggleAddTasksForm} 
          toggleEditTaskForm={toggleEditTaskForm}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {  modal, projects, timer, selectedProjectId } = state;
  const { hasFetched, isFetching } = projects;
  const { isModalActive } = modal;
  const { isTimerActive } = timer;
  
  return {
    selectedProjectId,
    hasFetched, 
    isFetching,
    isModalActive,
    isTimerActive, 
    projects: projects.items
  }
}

export default connect(mapStateToProps, {
  changeActiveEditMenu,
  deleteTask,
  fetchProjects,
  decrementTimer,
  setSelectedProject,
  toggleAddTasksForm,
  toggleEditTaskForm 
  
})(TimeTrackerPage);

TimeTrackerPage.propTypes = {
  projects: PropTypes.array
}
