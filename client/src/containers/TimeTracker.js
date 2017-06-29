import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import Isvg from 'react-inlinesvg';
import shortid from 'shortid';

import { secondsToHMMSS } from 'helpers/time';

import FormModal from './FormModal';
import List from '../components/List';
import ListHeader from '../components/ListHeader';
import ProjectHeading from '../components/ProjectHeading';
import ListItem from '../components/ListItem';
import RoundButton from '../components/RoundButton';
import TotalTime from '../components/TotalTime';
import Select from './Select';
import Timer from './Timer';

export default class TimeTracker extends Component {
  constructor(props) {
    super(props);
    
    const { tasks } = this.props;
    
    this.state = {
      activeTaskId: null,
      clickedTaskId: null,
      selectedTaskId: null, 
      tasks: tasks,
    }
  }
  
  static defaultProps = {
    tasks: []
  }
  
  componentDidMount() {
    if (!localStorage.getItem('isFirstUserVisit')) {
      localStorage.setItem('isFirstUserVisit', 'true');
    } else {
      localStorage.removeItem('isFirstUserVisit');
    }
  }
  componentWillReceiveProps(nextProps) {
      /*  if(nextProps.tasks !== this.props.tasks) {
      this.setState({
      tasks: nextProps.tasks,
      activeTaskId: nextProps.tasks.length > 0 ? nextProps.tasks[0].id : null
    })
  }*/
  }

  toggleShouldRenderModal(modalType) {
    const { shouldRenderModal } = this.state;
    
    let newModalState = { shouldRenderModal: !shouldRenderModal};
    
    if (modalType) { 
      const updatedModalType = { modalType: modalType};
      newModalState = Object.assign(newModalState, updatedModalType);
    }
    
    this.setState(newModalState);
  }
  
  handleAddButtonClick() {
    const { toggleAddTasksForm } = this.props
    
    toggleAddTasksForm();
  }
  
  handleAddTasks() {
    const { toggleAddTasksForm } = this.props;
    
    toggleAddTasksForm();
  }
  
  handleEditTask = (taskId) => () => {
    const { toggleEditTaskForm } = this.props;
    
    toggleEditTaskForm();
    this.setState({ clickedTaskId: taskId});
  } 

  handleTaskChange(taskId){
    this.setState({ selectedTaskId: taskId });
  }
  
  handleTaskDelete = (selectedProject, task) => () => {
    const { deleteTask } = this.props;
    
    deleteTask(selectedProject, task, true);  
  }
  
  handleTaskItemClick = (taskId) => () => {
    this.setState({ selectedTaskId: taskId });
  }
  
  renderTask (task){
    const { selectedProject, deleteTask, isTimerActive } = this.props;
    const { activeTaskId, selectedTaskId } = this.state;
    const { shortId, taskName, recordedTime } = task;
    
    return (
      <ListItem
        key={shortid.generate()}
        className="task"
        col1Text={taskName}
        col2Text={secondsToHMMSS(recordedTime)} 
        handleClick={this.handleTaskItemClick(shortId)}
        isActive={(activeTaskId === shortId) && isTimerActive}
        isSelected={selectedTaskId === shortId}
      >
        <li className="dropdown-item" onClick={this.handleEditTask(shortId)}><a>Edit</a></li>
        <li className="dropdown-item" onClick={this.handleTaskDelete(selectedProject, task)}><a>Delete</a></li>
      </ListItem>
    ); 
  } 
  
  renderTaskSelect() {
    const { tasks } = this.props;
    const { activeTaskId, selectedTaskId } = this.state; 
    
    const simplifiedTasks = tasks.map(task => ({
      name: task.taskName,
      id: task.shortId
    }));
    
    const selectedTask = tasks.find(task => task.shortId === selectedTaskId);
    const selectedTaskName = selectedTask && selectedTask.taskName;
    const taskSelectHeading = selectedTaskName || "Click to select a task...";
    
    const headingClass = selectedTaskName ? "" : "grey"; 
    
    return (
      <Select 
        className={"task-select"} 
        handleOptionClick={this.handleTaskChange.bind(this)}
        items={simplifiedTasks}
        >
          <span className={headingClass}>{taskSelectHeading}</span>
        </Select>
      );
    }
    
    renderProjectSelect() {
      const { projects, selectedProject, setSelectedProject } = this.props;
      
      const simplifiedProjects = projects.map(project => ({
        name: project.projectName,
        id: project.shortId
      }));
      
      return (
          <div className="project-select-wrapper">
            <span>Showing tasks for project: </span>
            <Select 
              className="project-select"
              handleOptionClick={setSelectedProject}
              items={simplifiedProjects}
            >
                <ProjectHeading 
                  text={selectedProject ? selectedProject.projectName : "No projects added yet"}
                  iconClass={"icon icon-dots-menu"} 
                />
              </Select>
          </div>
        );
      }
      
      render() {
        const { tasks } = this.props;
        const { activeTaskId, clickedTaskId, isModalActive } = this.state;
        const totalTime = tasks.length ? tasks.map((task) => Number(task.recordedTime)).reduce((a,b) => a + b) : 0;
        return (
          <div className="time-tracker">
            <div className="timer-section">
              <div className="timer-container">
                {this.renderTaskSelect()}
                <Timer activeTaskId={activeTaskId} />
              </div>
            </div>
            <div className="timer-task-list list-container">
              {this.renderProjectSelect()}
              <List className="task-list" items={tasks} renderItem={this.renderTask.bind(this)}>
                <ListHeader col1Title="Task" col2Title="Time Logged" />
              </List>
              <TotalTime time={secondsToHMMSS(totalTime)} />
            </div>
            
            <button className="add-button material-button" onClick={this.handleAddButtonClick.bind(this)}>ADD TASK</button> 
              
            <FormModal
              clickedTaskId={clickedTaskId}
              form="ADD_PROJECT"
              handleCloseButtonClick={this.toggleShouldRenderModal.bind(this)}
              isActive={isModalActive}
            /> 
          </div>
        );
      }
    }
    
    TimeTracker.propTypes = {
      tasks: PropTypes.array
    }