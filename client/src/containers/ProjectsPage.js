import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FontAwesome from 'react-fontawesome';
import { hashHistory } from 'react-router';
import shortid from 'shortid';

import { secondsToHMMSS } from '../helpers/time';
import { routeToTimerPage } from '../helpers/route';

import {
  addProject,
  changeActiveContextMenu,
  confirmDeleteProject,
  deleteProject,
  setSelectedProject,
  setTempTasks,
  toggleTimer, 
  updateProjectName
} from '../actions/indexActions';

import Modal from './Modal';
import ContextMenu from './ContextMenu';
import List from '../components/List';
import ListHeader from '../components/ListHeader';
import ListItem from '../components/ListItem';
import Nag from '../components/Nag';
import TimesheetListItem from '../components/TimesheetListItem';
import Timesheet from '../components/Timesheet';
import TotalTime from '../components/TotalTime';

class ProjectsPage extends Component {
  constructor(){
    super();
    
    this.state = {
      isProjectSelectTipActive: sessionStorage.isProjectSelectTipActive !== undefined
        ? JSON.parse(sessionStorage.isProjectSelectTipActive) 
        : true
    }
  }
  
  static defaultProps = {
    projects: ['filler']
  }
  
  componentWillMount() {
    const { isOnboardingActive } = this.props;
    
    if (isOnboardingActive) {
      routeToTimerPage();
    } 
  }
  
  componentWillMount() {
    
  }   

  handleAddButtonClick() {
    const { setTempTasks } = this.props;
    
    setTempTasks([]);
    hashHistory.push('/projects/new');
  }
  
  handleDeleteOptionClick = (project) => (evt) => {
    evt.stopPropagation();
    
    const { confirmDeleteProject } = this.props;
    
    confirmDeleteProject({ payload: project });
  }
  
  handleEditOptionClick = (project) => (evt) => {
    evt.stopPropagation()
    const { setSelectedProject } = this.props;
    
    setSelectedProject(project.shortId);
    hashHistory.push(`/projects/${project.shortId}`)
  }  
  
  handleListItemClick = (projectId) => () => {
    const { isTimerActive, setSelectedProject, toggleTimer } = this.props;
    if (isTimerActive) {
     toggleTimer();
    }
      
    setSelectedProject(projectId);
    routeToTimerPage();
  }  
  
  toggleProjectSelectTip() {
    sessionStorage.setItem('isProjectSelectTipActive', false);
    
    this.setState({ isProjectSelectTipActive: false });
  }
  
  renderProject (project){
    const { changeActiveContextMenu, projects, selectedProjectId } = this.props;
    const { projectName, shortId } = project;
    
    const totalTime = 
      project.tasks.length > 0
        ? project.tasks.map(task => task.recordedTime).reduce((a,b) => a + b)
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
          className='list-item-context-menu'
          onMenuClick={changeActiveContextMenu}    
          parentId={shortId}
        >
          <li className="popup-menu-item" onClick={this.handleEditOptionClick(project)}>
            <i className="context-menu-icon icon-edit"></i>
            <a>Edit</a>
          </li>
          <li className="popup-menu-item" onClick={this.handleDeleteOptionClick(project)}>
            <i className="context-menu-icon icon-delete"></i>
            <a>Delete</a>
          </li>
        </ContextMenu>  
      </TimesheetListItem>
    );
  } 
  
  getTotalTime() {
    const { projects } = this.props;
    
    if(!projects.length) {
      return 0; 
    }
    
    return projects.map(project => {
      if (!project.tasks.length) {
        return 0;
      }
          
      return project.tasks.map(task => Number(task.recordedTime)).reduce((a,b) => a + b);
    })
    .reduce((a,b) => a + b);
  }
  
  render() {
    const { hasFetched, isModalClosing, isOnboardingActive, projects } = this.props;
    const { isProjectSelectTipActive } = this.state;
    const reverseProjects = projects.slice().reverse();
    const totalTime = this.getTotalTime();
    
    if (!hasFetched){
      return <div className="loader">Loading...</div>;
    }
    
    return (
      // <div className='projects-page-container pt-page-moveFromBottomFade'>
      <div>
        {/* { (isProjectSelectTipActive && projects.length > 1) && 
          <div className="project-select-tip-wrapper">
            <div className="project-select-tip">
              <FontAwesome className="info-icon" name='info-circle'></FontAwesome>  
              <span>To track time for a different project, simply select it from the list below.</span>
              <button onClick={this.toggleProjectSelectTip.bind(this)}>
                <i className="icon-close"></i>   
              </button>
            </div>
          </div>  
        } */}
        { projects.length 
          ? <Timesheet
              buttonText="NEW PROJECT"
              handleButtonClick={this.handleAddButtonClick.bind(this)}
              titleText={"Projects"} 
            >
              <List className="timesheet-list list" items={projects} renderItem={this.renderProject.bind(this)}/>
              <TotalTime time={secondsToHMMSS(totalTime)} />
            </Timesheet>
          : <div>
              <Nag
                actionButtonText="ADD PROJECT"
                nagMessage="Please create a project to continue."
                onActionButtonClick={this.handleAddButtonClick.bind(this)}
              /> 
          </div>
        }
        <Modal modalClass={`${isOnboardingActive ? 'fullscreen-modal' : 'normal-modal'}`}
          rootModalClass={`${ isOnboardingActive? 'unfold' : 'roadrunner'} ${ isModalClosing ? 'out' : ''}`}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const {  projects, modal, selectedProjectId, timer } = state; 
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
  }
}

export default connect(mapStateToProps, { 
  addProject,
  confirmDeleteProject,
  changeActiveContextMenu,
  deleteProject,
  setSelectedProject,
  setTempTasks,
  toggleTimer,
  updateProjectName
})(ProjectsPage);

ProjectsPage.propTypes = {
  projects: PropTypes.array.isRequired
}