import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { hashHistory } from 'react-router';
import shortid from 'shortid';

import { secondsToHMMSS } from 'helpers/time';

import ContextMenu from './ContextMenu';
import Modal from './Modal';
import List from '../components/List';
import Nag from '../components/Nag';
import TimesheetListItem from '../components/TimesheetListItem';
import Timesheet from '../components/Timesheet';
import TotalTime from '../components/TotalTime';
import Select from './Select';
import Timer from './Timer';

import { isDevOnboardingActive } from '../srcConfig/devSettings';

export default class TimeTracker extends Component {
  constructor(props) {
    super(props);

    const { tasks } = this.props;

    this.state = {
      activeTaskId: null,
      activeContextMenuParentId: null,
      clickedTaskId: null,
      selectedTaskId: null,
      tasks,
    };
  }

  static defaultProps = {
    tasks: [],
  }

  componentWillMount() {
    const { isOnboardingActive, projects, selectedProject, setSelectedProject, toggleOnboardMode } = this.props;

    if (isDevOnboardingActive) {
      !isOnboardingActive && toggleOnboardMode();
      return null;
    }

    if (
      (sessionStorage.isFirstSessionVisit === undefined && isDevOnboardingActive) ||
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
      projects.find((project) => { return project.shortId === localStorage.selectedProjectId; })
    ) {
      setSelectedProject(localStorage.selectedProjectId);
    } else {
      setSelectedProject(projects[projects.length - 1].shortId);
    }

    this.setState({ selectedTaskId: localStorage.prevSelectedTaskId });
  }

  componentDidUpdate(prevProps, prevState) {
    const { tasks } = this.props;

    if ((prevProps.tasks.length !== tasks.length) && (tasks.length === 0)) {
      localStorage.setItem('prevSelectedTaskId', null);
      this.setState({ selectedTaskId: null });
    }
  }

  componentWillReceiveProps(nextProps) {
    /*  if(nextProps.tasks !== this.props.tasks) {
      this.setState({
      tasks: nextProps.tasks,
      activeTaskId: nextProps.tasks.length > 0 ? nextProps.tasks[0].id : null
    })
    } */
  }

  handleAddTasks() {
    const { toggleAddTasksForm } = this.props;

    toggleAddTasksForm();
  }

  handleEditTask = (taskId) => {
    return () => {
      const { toggleEditTaskForm } = this.props;

      toggleEditTaskForm(taskId);
    };
  }

  handleTaskChange(taskId, callback) {
    if (localStorage.prevSelectedTaskId !== taskId) {
      localStorage.setItem('prevSelectedTaskId', taskId);
    }

    this.setState({ selectedTaskId: taskId });
  }

  handlePlayClick = (taskId) => {
    return () => {
      const { isTimerActive, toggleTimer } = this.props;
      const { selectedTaskId } = this.state;

      if (isTimerActive && (selectedTaskId === taskId)) {
        toggleTimer();
        return null;
      }

      if (isTimerActive && !(selectedTaskId === taskId)) {
        this.setState({ activeTaskId: taskId });
        this.handleTaskChange(taskId);
        return null;
      }

      this.setState({ activeTaskId: taskId }, toggleTimer);
      this.handleTaskChange(taskId);
    };
  }

  handleTaskDelete = (selectedProject, task) => {
    return () => {
      const { confirmDeleteTask } = this.props;

      confirmDeleteTask({
        payload: [selectedProject, task, true],
        taskName: task.taskName,
      });
    };
  }

  handleTaskItemClick = (taskId) => {
    return () => {
      this.handleTaskChange(taskId);
    };
  }

  setActiveTask(selectedTaskId) {
    this.setState({ activeTaskId: selectedTaskId });
  }

  setActiveContextMenu = (activeContextMenuParentId) => {
    return () => {
      this.setState({ activeContextMenuParentId });
    };
  }

  renderTask(task) {
    const { changeActiveContextMenu, isTimerActive, selectedProject, tasks, toggleTimer } = this.props;
    const { activeTaskId, selectedTaskId } = this.state;
    const { shortId, taskName, recordedTime } = task;

    return (
      <TimesheetListItem
        actionIconClass="play"
        key={shortid.generate()}
        // className="task"
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
          <li className="popup-menu-item" onClick={this.handleEditTask(shortId)}>
            <i className="context-menu-icon icon-edit" />
            <a>Edit</a>
          </li>
          <li className="popup-menu-item" onClick={this.handleTaskDelete(selectedProject, task)}>
            <i className="context-menu-icon icon-delete" />
            <a>Delete</a>
          </li>
        </ContextMenu>
      </TimesheetListItem>
    );
  }

  renderTaskSelect() {
    const { tasks } = this.props;
    const { selectedTaskId } = this.state;

    const simplifiedTasks = tasks.map((task) => {
      return {
        name: task.taskName,
        id: task.shortId,
      };
    });

    const selectedTask = tasks.find((task) => { return task.shortId === selectedTaskId; });
    const selectedTaskName = selectedTask && selectedTask.taskName;
    const taskSelectHeading = selectedTaskName || 'Click to select a task...';
    const headingClass = selectedTaskName ? '' : 'grey';

    return (
      <Select
        className={'task-select'}
        handleOptionClick={this.handleTaskChange.bind(this)}
        items={simplifiedTasks}
      >
        <span className={headingClass}>{taskSelectHeading}</span>
      </Select>
    );
  }

  // renderProjectSelect() {
  //   const { projects, selectedProject, setSelectedProject } = this.props;
  //   
  //   const simplifiedProjects = projects.map(project => ({
  //     name: project.projectName,
  //     id: project.shortId
  //   }));
  //   
  //   return (
  //     <div className="project-select-wrapper">
  //       <span>Timesheet for project <span>{selectedProject.projectName}</span></span>
  //       <ProjectHeading 
  //         text={selectedProject ? selectedProject.projectName : "No projects added yet"}
  //         iconClass={"icon icon-dots-menu"} 
  //       />
  //     </div>
  //   );
  // }

  render() {
    const { isModalClosing, isOnboardingActive, selectedProject, tasks, toggleConfig } = this.props;
    const { activeTaskId, selectedTaskId } = this.state;
    const totalTime = tasks.length ? tasks.map((task) => { return Number(task.recordedTime); }).reduce((a, b) => { return a + b; }) : 0;
    const selectedProjectName = selectedProject ? selectedProject.projectName : '';

    return (
      // <div className="time-tracker">
      <div>
        <section className="timer-section">
          <div className="timer-settings-wrapper" onClick={toggleConfig}>
            <FontAwesome className="timer-settings-icon" name="gear" />
          </div>
          <div className="timer-container">
            {tasks.length > 0 && this.renderTaskSelect()}
            <Timer
              activeTaskId={activeTaskId}
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              setActiveTask={this.setActiveTask.bind(this)}
            />
          </div>
        </section>
        {tasks.length > 0
          ? <section className="timesheet-section">
            <Timesheet
              buttonText="NEW TASKS"
              handleButtonClick={this.handleAddTasks.bind(this)}
              titleText={['Tasks for project ', <span className={'grey-title-text'} key={shortid.generate()}>{selectedProject.projectName}</span>]}
            >
              <List className="timesheet-list list" items={tasks} renderItem={this.renderTask.bind(this)} />
              <TotalTime time={secondsToHMMSS(totalTime)} />
            </Timesheet>
          </section>
          : <Nag
            actionButtonText="ADD TASKS"
            nagMessage={<span>Add tasks to project <span className="grey-title-text">{selectedProjectName}</span> to start tracking time.</span>}
            onActionButtonClick={this.handleAddTasks.bind(this)}
          />
        }
        <Modal
          isCloseButtonActive={isDevOnboardingActive || !isOnboardingActive}
          modalClass={`${isOnboardingActive ? 'fullscreen-modal' : 'normal-modal'}`}
          rootModalClass={`${isOnboardingActive ? 'unfold' : 'roadrunner'} ${isModalClosing ? 'out' : ''}`}
        />
      </div>
    );
  }
}

TimeTracker.propTypes = {
  tasks: PropTypes.array,
};
