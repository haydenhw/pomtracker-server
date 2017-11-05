import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import shortid from 'shortid';
import { SubmissionError, reduxForm } from 'redux-form';

import {
  addTempTask,
  closeModal,
  deleteTask,
  postTask,
  setTempTasks,
  toggleModal,
  toggleOnboardMode,
  toggleShouldDelete,
  updateTasks,
} from '../actions/indexActions';

import { hasAnyValue, isDuplicate } from '../helpers/validate';

import AddTasksForm from '../components/AddTasksForm';
import RemoteSubmitForm from './RemoteSubmitForm';

let AddTasksFormContainer = class extends Component {
  constructor(props) {
    super(props);
    this.deleteButtonRefs = {};
  }

  componentDidMount() {
    const {
      isModalActive,
      isOnboardingActive,
      setTempTasks,
      showTasksForSelectedProject,
      tasks,
    } = this.props;

    if (showTasksForSelectedProject || (!isOnboardingActive && isModalActive)) {
      setTempTasks(tasks);
    }
  }

  handleAddTask = ({ taskName }) => {
    const { addTempTask, reset, formTasks: tasks } = this.props;
    const taskNames = tasks.map(task => task.taskName);

    if (!hasAnyValue(taskName)) {
      return null;
    }

    if (isDuplicate(taskName, taskNames)) {
      throw new SubmissionError({
        taskName: `A task with the name '${taskName}' already exists`,
      });
    }

    const newTask = {
      taskName,
      key: shortid.generate(),
      recordedTime: 0,
      shortId: shortid.generate(),
      shouldDelete: false,
    };

    addTempTask(newTask);
    reset('taskName');
  }

  handleFormSubmit = () => {
    const {
      closeModal,
      isOnboardingActive,
      updateTasks,
      selectedProject,
      toggleOnboardMode,
      formTasks: tasks,
    } = this.props;

    const tasksToSubmit = tasks.filter(task => !task.shouldDelete);

    if (!tasksToSubmit.length && isOnboardingActive) {
      throw new SubmissionError({
        taskName: 'Please add at least one task',
      });
    }

    updateTasks(selectedProject, tasks);
    isOnboardingActive ? toggleOnboardMode() : closeModal();
  }

  handleDeleteButtonClick = taskId => () => {
    const { toggleShouldDelete } = this.props;

    toggleShouldDelete(taskId);
  }

  handleDeleteButtonMouseOver = taskId => () => {
    this.deleteButtonRefs[taskId].focus();
  }

  handleDeleteButtonMouseOut = taskId => () => {
    this.deleteButtonRefs[taskId].blur();
  }

  renderFormTask = (task) => {
    const { shouldDelete, shortId, taskName } = task;

    return (
      <div className="task-list-item" key={shortid.generate()}>
        <div className="task-list-button-wrapper" >
          <button
            className={`${shouldDelete ? 'task-list-restore' : 'task-list-delete'} circular-delete`}
            ref={(el) => { this.deleteButtonRefs[shortId] = el; }}
            onClick={this.handleDeleteButtonClick(shortId)}
            onMouseOver={this.handleDeleteButtonMouseOver(shortId)}
            onMouseOut={this.handleDeleteButtonMouseOut(shortId)}
          >
            { shouldDelete ? 'Restore' : <div className="icon-close" /> }
          </button>
        </div>
        <div className="task-list-name-wrapper">
          <span>{taskName}</span>
        </div>
      </div>
    );
  }

  render() {
    const { currentRoute, isModalActive, isOnboardingActive } = this.props;

    return (
      <RemoteSubmitForm
        onTargetUpdate={this.handleFormSubmit}
      >
        <AddTasksForm
          {...this.props}
          childContainerClass={(isModalActive && currentRoute !== '/projects/new') ? 'form-container onboarding-form' : ''}
          fieldAnimationName={isOnboardingActive ? 'bounce-in-down-second' : ''}
          formAnimationName={isOnboardingActive ? '' : 'bounce-in-down'}
          handleFormSubmit={this.handleFormSubmit}
          handleTaskSubmit={this.handleAddTask}
          parentContainerClass={(isOnboardingActive || /projects/.test(currentRoute)) ? 'fullscreen-container' : 'bounce-in-down'}
          renderFormTask={this.renderFormTask}
          shouldAutoFocus={isModalActive}
          submitButtonClass={`${isOnboardingActive ? 'fade-in-medium-delay' : 'fade-in-short-delay'} outline-button modal-button-bottom-right`}
          titleAnimationName={isOnboardingActive ? 'bounce-in-down' : ''}
        />
      </RemoteSubmitForm>
    );
  }
};

const mapStateToProps = (state, ownProps) => {
  const { customForm, modal, projects } = state;
  const { isModalActive, isOnboardingActive } = modal;
  const { selectedProjectId } = projects;
  const formTasks = customForm.taskForm.tasks;

  const selectedProject = projects.items.find(project => project.shortId === selectedProjectId);
  const selectedProjectDatabaseId = selectedProject && selectedProject._id;

  const tasks = selectedProject && (ownProps.showTasksForSelectedProject !== false)
    ? selectedProject.tasks.map(task => Object.assign(task, { shouldDelete: false }))
    : [];

  return {
    selectedProject,
    selectedProjectId,
    selectedProjectDatabaseId,
    isModalActive,
    isOnboardingActive,
    tasks,
    formTasks,
  };
};

AddTasksFormContainer = reduxForm({
  form: 'addTasks',
})(AddTasksFormContainer);

export default AddTasksFormContainer = connect(mapStateToProps, {
  addTempTask,
  closeModal,
  deleteTask,
  postTask,
  setTempTasks,
  toggleModal,
  toggleOnboardMode,
  toggleShouldDelete,
  updateTasks,
})(AddTasksFormContainer);

AddTasksFormContainer.propTypes = {
  addTempTask: PropTypes.func,
  closeModal: PropTypes.func,
  currentRoute: PropTypes.string,
  formAnimationName: PropTypes.string,
  formTasks: PropTypes.array,
  handleSubmit: PropTypes.func,
  isModalActive: PropTypes.bool,
  isOnboardingActive: PropTypes.bool,
  reset: PropTypes.func,
  selectedProject: PropTypes.object,
  setTempTasks: PropTypes.func,
  showTasksForSelectedProject: PropTypes.bool,
  tasks: PropTypes.array,
  toggleModal: PropTypes.func,
  toggleOnboardMode: PropTypes.func,
  toggleShouldDelete: PropTypes.func,
  updateTasks: PropTypes.func,
};
