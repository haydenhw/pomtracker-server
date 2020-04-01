import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import shortid from 'shortid';

import { secondsToHMMSS } from '../helpers/time';
import { routeToTimerPage } from '../helpers/route';

import {
  changeActiveContextMenu,
  confirmDeleteProject,
  setSelectedProject,
  setTempTasks,
  toggleTimer,
} from '../actions/indexActions';

import List from '../components/List';
import Nag from '../components/Nag';
import Timesheet from '../components/Timesheet';
import TimesheetListItem from '../components/TimesheetListItem';
import TotalTime from '../components/TotalTime';
import ContextMenu from './ContextMenu';
import Modal from './Modal';

class ProjectsPage extends Component {
  static defaultProps = {
    projects: ['dummyString'],
  }

  componentWillMount() {
    const { isOnboardingActive } = this.props;

    if (isOnboardingActive) {
      routeToTimerPage();
    }
  }

  getTotalTime() {
    const { projects } = this.props;

    if (!projects.length) {
      return 0;
    }

    return projects.map((project) => {
      if (!project.tasks.length) {
        return 0;
      }

      return project.tasks.map(task => Number(task.recordedTime)).reduce((a, b) => a + b);
    })
      .reduce((a, b) => a + b);
  }

  handleAddButtonClick = () => {
    const { setTempTasks } = this.props;

    setTempTasks([]);
    hashHistory.push('/projects/new');
  }

  handleProjectDelete = project => (evt) => {
    evt.stopPropagation();

    const { confirmDeleteProject } = this.props;

    confirmDeleteProject({ payload: project });
  }

  handleProjectEdit = project => (evt) => {
    evt.stopPropagation();
    const { setSelectedProject } = this.props;

    setSelectedProject(project.shortId);
    hashHistory.push(`/projects/${project.shortId}`);
  }

  handleListItemClick = projectId => () => {
    const { isTimerActive, setSelectedProject, toggleTimer } = this.props;
    if (isTimerActive) {
      toggleTimer();
    }

    setSelectedProject(projectId);
    routeToTimerPage();
  }

  renderProject = (project) => {
    const { changeActiveContextMenu, projects, selectedProjectId } = this.props;
    const { projectName, shortId } = project;

    const totalTime =
      project.tasks.length > 0
        ? project.tasks.map(task => task.recordedTime).reduce((a, b) => a + b)
        : 0;

    return (
      <TimesheetListItem
        actionIconClass="arrow-right"
        key={shortid.generate()}
        handleItemClick={this.handleListItemClick(shortId)}
        handlePlayClick={this.handleListItemClick(shortId)}
        isSelected={(selectedProjectId === shortId) && (projects.length > 1)}
        title={projectName}
        time={totalTime}
      >
        <ContextMenu
          className="list-item-context-menu"
          onMenuClick={changeActiveContextMenu}
          parentId={shortId}
        >
          <li className="popup-menu-item" onClick={this.handleProjectEdit(project)} role="menuitem">
            <i className="context-menu-icon icon-edit" />
            <a className="popup-menu-item-name">Edit</a>
          </li>
          <li
            className="popup-menu-item"
            onClick={this.handleProjectDelete(project)}
            role="menuitem"
          >
            <i className="context-menu-icon icon-delete" />
            <a className="popup-menu-item-name">Delete</a>
          </li>
        </ContextMenu>
      </TimesheetListItem>
    );
  }

  render() {
    const { hasFetched, isModalClosing, isOnboardingActive, projects } = this.props;
    const totalTime = this.getTotalTime();

    if (!hasFetched) {
      return <div className="loader">Loading...</div>;
    }

    return (
      <div>
        {projects.length
          ? <Timesheet
            buttonText="NEW PROJECT"
            className="timesheet-projects"
            handleButtonClick={this.handleAddButtonClick}
            titleText={'Projects'}
          >
            <List
              className="timesheet-list list"
              items={projects}
              renderItem={this.renderProject}
            />
            <TotalTime time={secondsToHMMSS(totalTime)} />
          </Timesheet>
          : <div>
            <Nag
              actionButtonText="ADD PROJECT"
              className="nag-projects"
              nagMessage="Please create a project to continue."
              onActionButtonClick={this.handleAddButtonClick}
            />
          </div>
        }
        <Modal
          modalClass={`${isOnboardingActive ? 'fullscreen-modal' : 'normal-modal'}`}
          rootModalClass={
            `${isOnboardingActive ? 'unfold' : 'roadrunner'}
            ${isModalClosing ? 'out' : ''}`
          }
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { projects, modal, timer } = state;
  const { selectedProjectId } = projects;
  const { isOnboardingActive, isModalClosing } = modal;
  const { hasFetched } = projects;
  const { isTimerActive } = timer;

  return {
    hasFetched,
    isModalClosing,
    isOnboardingActive,
    isTimerActive,
    selectedProjectId,
    projects: projects.items,
  };
};

export default connect(mapStateToProps, {
  confirmDeleteProject,
  changeActiveContextMenu,
  setSelectedProject,
  setTempTasks,
  toggleTimer,
})(ProjectsPage);

ProjectsPage.propTypes = {
  changeActiveContextMenu: PropTypes.func.isRequired,
  confirmDeleteProject: PropTypes.func.isRequired,
  hasFetched: PropTypes.bool,
  isModalClosing: PropTypes.bool,
  isOnboardingActive: PropTypes.bool,
  isTimerActive: PropTypes.bool,
  projects: PropTypes.array.isRequired,
  selectedProjectId: PropTypes.string,
  setSelectedProject: PropTypes.func.isRequired,
  setTempTasks: PropTypes.func.isRequired,
  toggleTimer: PropTypes.func.isRequired,
};
