import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import shortid from 'shortid';

import {
  deleteTask,
  decrementTimer,
  changeActiveContextMenu,
  confirmDeleteTask,
  fetchProjects,
  setSelectedProject,
  setActiveTask,
  setSelectedTask,
  setTempTasks,
  startRecordingTask,
  stopRecordingTasks,
  switchRecordingTask,
  toggleAddTasksForm,
  toggleConfig,
  toggleEditTaskForm,
  toggleOnboardMode,
  toggleTimer,
} from '../actions/indexActions';

import { secondsToHMMSS } from '../helpers/time';

import List from '../components/List';
import Nag from '../components/Nag';
import Timesheet from '../components/Timesheet';
import TimesheetListItem from '../components/TimesheetListItem';
import TotalTime from '../components/TotalTime';
import ContextMenu from './ContextMenu';
import Modal from './Modal';
import Select from './Select';
import Timer from './Timer';

import { isDevOnboardingActive } from '../src-config/devSettings';

const TimerPage = class extends Component {
  static defaultProps = {
    tasks: [],
  }

  constructor(props) {
    super(props);

    this.state = {
      activeContextMenuParentId: null,
    };
  }

  componentWillMount() {
    const {
      isOnboardingActive,
      projects,
      setSelectedProject,
      setSelectedTask,
      toggleOnboardMode,
    } = this.props;

    if (isDevOnboardingActive && !isOnboardingActive) {
      toggleOnboardMode();
      return null;
    }

    if (
      ((sessionStorage.isFirstSessionVisit === undefined)) ||
      ((projects.length === 0) && isOnboardingActive)
    ) {
      sessionStorage.isFirstSessionVisit = false;
      toggleOnboardMode();
      return null;
    }

    if ((projects.length === 0) && !isOnboardingActive) {
      hashHistory.push('/projects');
      return null;
    }

    if (
      localStorage.selectedProjectId &&
      projects.find(project => project.shortId === localStorage.selectedProjectId)
    ) {
      setSelectedProject(localStorage.selectedProjectId);
    } else {
      setSelectedProject(projects[projects.length - 1].shortId);
    }

    setSelectedTask(localStorage.prevSelectedTaskId);
  }

  shouldComponentUpdate(nextProps) {
    const { isModalActive } = this.props;

    if (
      this.props.selectedProjectId &&
      (nextProps.selectedProjectId !== this.props.selectedProjectId) &&
      isModalActive
    ) {
      return false;
    }

    return true;
  }

  componentDidUpdate(prevProps) {
    const { tasks } = this.props;

    if ((prevProps.tasks.length !== tasks.length) && (tasks.length === 0)) {
      localStorage.setItem('prevSelectedTaskId', null);

      setSelectedTask(null);
    }
  }

  setActiveContextMenu = activeContextMenuParentId => () => {
    this.setState({ activeContextMenuParentId });
  }

  handleAddTasks = () => {
    const { toggleAddTasksForm } = this.props;

    toggleAddTasksForm();
  }

  handleEditTask = taskId => () => {
    const { toggleEditTaskForm } = this.props;

    toggleEditTaskForm(taskId);
  }

  handlePlayClick = taskId => (evt) => {
    const {
      isTimerActive,
      activeTaskId,
      startRecordingTask,
      stopRecordingTasks,
      switchRecordingTask,
    } = this.props;

    evt.stopPropagation();

    if (isTimerActive && (activeTaskId === taskId)) {
      stopRecordingTasks();
    } else if (isTimerActive && !(activeTaskId === taskId)) {
      switchRecordingTask(taskId);
    } else {
      startRecordingTask(taskId);
    }
  }

  handleTaskChange = (taskId) => {
    const { isTimerActive, setSelectedTask, switchRecordingTask } = this.props;

    if (localStorage.prevSelectedTaskId !== taskId) {
      localStorage.setItem('prevSelectedTaskId', taskId);
    }

    if (isTimerActive) {
      switchRecordingTask(taskId);
    } else {
      setSelectedTask(taskId);
    }
  }

  handleTaskDelete = (selectedProject, task) => () => {
    const { confirmDeleteTask } = this.props;

    confirmDeleteTask({
      payload: [selectedProject, task, true],
      taskName: task.taskName,
    });
  }

  handleTaskItemClick = taskId => () => {
    this.handleTaskChange(taskId);
  }

  renderTask = (task) => {
    const {
      activeTaskId,
      changeActiveContextMenu,
      isTimerActive,
      selectedProject,
      selectedTaskId,
    } = this.props;

    const { shortId, taskName, recordedTime } = task;

    return (
      <TimesheetListItem
        actionIconClass="play"
        key={shortid.generate()}
        handleItemClick={this.handleTaskItemClick(shortId)}
        handlePlayClick={this.handlePlayClick(shortId)}
        isActive={(activeTaskId === shortId) && isTimerActive}
        isSelected={selectedTaskId === shortId}
        title={taskName}
        time={recordedTime}

      >
        <ContextMenu
          className="list-item-context-menu"
          onMenuClick={changeActiveContextMenu}
          parentId={shortId}
        >
          <li className="popup-menu-item" onClick={this.handleEditTask(shortId)} role="menuitem">
            <i className="context-menu-icon icon-edit" />
            <a className="popup-menu-item-name">Edit</a>
          </li>
          <li
            className="popup-menu-item"
            onClick={this.handleTaskDelete(selectedProject, task)}
            role="menuitem"
          >
            <i className="context-menu-icon icon-delete" />
            <a className="popup-menu-item-name">Delete</a>
          </li>
        </ContextMenu>
      </TimesheetListItem>
    );
  }

  renderTaskSelect() {
    const { selectedTaskId, tasks } = this.props;

    const simplifiedTasks = tasks.map((task) => {
      return {
        name: task.taskName,
        id: task.shortId,
      };
    });

    const selectedTask = tasks.find(task => task.shortId === selectedTaskId);
    const selectedTaskName = selectedTask && selectedTask.taskName;
    const taskSelectHeading = selectedTaskName || 'Click to select a task...';
    const headingClass = selectedTaskName ? '' : 'grey';

    return (
      <Select
        className={'task-select'}
        handleOptionClick={this.handleTaskChange}
        items={simplifiedTasks}
      >
        <span className={headingClass}>{taskSelectHeading}</span>
      </Select>
    );
  }

  render() {
    const {
      activeTaskId,
      hasFetched,
      isModalClosing,
      isOnboardingActive,
      selectedProject,
      selectedTaskId,
      tasks,
    } = this.props;


    const totalTime = tasks.length
      ? tasks.map(task => Number(task.recordedTime)).reduce((a, b) => a + b)
      : 0;
    const selectedProjectName = selectedProject ? selectedProject.projectName : '';

    if (!hasFetched) {
      return <div className="loader">Loading...</div>;
    }

    return (
      <div>
        <section className="timer-section">
          <div className="timer-container">
            {tasks.length > 0 && this.renderTaskSelect()}
            <Timer
              activeTaskId={activeTaskId}
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              setActiveTask={setActiveTask}
            />
          </div>
        </section>
        {tasks.length > 0
          ? <section className="timesheet-section">
            <Timesheet
              buttonText="NEW TASKS"
              handleButtonClick={this.handleAddTasks}
              titleText={
                <span>Tasks for project
                  <span className={'grey-title-text'} key={shortid.generate()}>
                    {` ${selectedProject.projectName}`}
                  </span>
                </span>
              }
            >
              <List className="timesheet-list list" items={tasks} renderItem={this.renderTask} />
              <TotalTime time={secondsToHMMSS(totalTime)} />
            </Timesheet>
          </section>
          : <Nag
            actionButtonText="ADD TASKS"
            nagMessage={
              <span>Add tasks to project
                <span className="grey-title-text">
                  {` ${selectedProjectName}`}
                </span> to start tracking time.
              </span>
            }
            onActionButtonClick={this.handleAddTasks}
          />
        }
        <Modal
          isCloseButtonActive={isDevOnboardingActive || !isOnboardingActive}
          modalClass={`${isOnboardingActive ? 'fullscreen-modal' : 'normal-modal'}`}
          rootModalClass={
            `${isOnboardingActive ? 'unfold' : 'roadrunner'}
             ${isModalClosing ? 'out' : ''}`
          }
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  const { modal, projects, timer } = state;
  const { activeTaskId, hasFetched, isFetching, selectedProjectId, selectedTaskId } = projects;
  const { isModalActive, isModalClosing, isOnboardingActive } = modal;
  const { isTimerActive } = timer;

  const selectedProject = projects.items.find(project => project.shortId === selectedProjectId);
  const selectedTasks = selectedProject && selectedProject.tasks;

  return {
    activeTaskId,
    hasFetched,
    isFetching,
    isModalActive,
    isModalClosing,
    isOnboardingActive,
    isTimerActive,
    selectedProject,
    selectedTaskId,
    selectedTasks,
    projects: projects.items,
    tasks: selectedTasks,
  };
};

export default connect(mapStateToProps, {
  changeActiveContextMenu,
  confirmDeleteTask,
  decrementTimer,
  deleteTask,
  fetchProjects,
  setSelectedProject,
  setActiveTask,
  setSelectedTask,
  setTempTasks,
  startRecordingTask,
  stopRecordingTasks,
  switchRecordingTask,
  toggleAddTasksForm,
  toggleConfig,
  toggleEditTaskForm,
  toggleOnboardMode,
  toggleTimer,
})(TimerPage);

TimerPage.propTypes = {
  activeTaskId: PropTypes.string,
  changeActiveContextMenu: PropTypes.func.isRequired,
  confirmDeleteTask: PropTypes.func.isRequired,
  hasFetched: PropTypes.bool,
  isModalActive: PropTypes.bool,
  isModalClosing: PropTypes.bool,
  isOnboardingActive: PropTypes.bool,
  isTimerActive: PropTypes.bool,
  projects: PropTypes.array,
  selectedProject: PropTypes.object,
  selectedProjectId: PropTypes.string,
  selectedTaskId: PropTypes.string,
  setSelectedProject: PropTypes.func.isRequired,
  setSelectedTask: PropTypes.func.isRequired,
  startRecordingTask: PropTypes.func.isRequired,
  stopRecordingTasks: PropTypes.func.isRequired,
  switchRecordingTask: PropTypes.func.isRequired,
  tasks: PropTypes.array,
  toggleAddTasksForm: PropTypes.func.isRequired,
  toggleEditTaskForm: PropTypes.func.isRequired,
  toggleOnboardMode: PropTypes.func.isRequired,
};
