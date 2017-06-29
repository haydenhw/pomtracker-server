import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shortid from 'shortid';

import { 
  addTask,
  changeModalType,
  confirmEditTaskTime,
  postProject,
  setSelectedProject,
  toggleModal
} from '../actions/indexActions';


import Modal from './Modal';
import AddProjectForm from '../components/AddProjectForm';
import EditTaskForm from '../components/EditTaskForm';
import ConfirmEditTask from './ConfirmEditTask';
import AddTasksFormContainer from './AddTasksFormContainer';


class FormModal extends Component {
  constructor(){
    super();
    
    this.state = {
      isContentWaiting: true
    }
  }
  deleteTask (taskId) {
    this.props.deleteTask('123', '111');
  }
  
  handleAddProject = () => ({ projectName }) => {
    const { changeModalType, postProject } = this.props;
    
    postProject(projectName)
    this.toggleIsContentWaiting();
    changeModalType('ADD_TASKS');
  }
  
  handleGetStarted() {
    const { changeModalType } = this.props;
    
    this.toggleIsContentWaiting();
    changeModalType('ADD_PROJECT');
  }
  
  toggleIsContentWaiting() {
    this.setState({isContentWaiting: true});
  }
  
  renderFormTask (task) {
    const { taskName } = task;
    
    return (
      <div className="form-task-list-item" key={shortid.generate()}>
        <span>{taskName}</span>
        <div className="button-wrapper">
          <button onClick={this.deleteTask.bind(this)}>&times;</button>
        </div>
      </div>
    );
  }
  
  renderFormElement(elementType) {
    const { selectedProjectName, clickedTaskId, modalProps, modalType, projects } = this.props;
    
    switch (true) {
      case (modalType === "WELCOME") && (elementType === "TITLE"): 
      return <h2>Welcome to PomTracker!</h2>;
      
      case (modalType === "WELCOME") && (elementType === "CONTENT"): 
        return (
        <div>
          <p>Click below to add you first project</p>
          <button className="form-button" onClick={this.handleGetStarted.bind(this)}>Get Started</button>
        </div>
      );
      
      case (modalType === "ADD_PROJECT") && (elementType === "TITLE"): 
        return <h2 className="project-form-title">Add a project</h2>;
      
      case (modalType === "ADD_PROJECT") && (elementType === "CONTENT"): 
        return (
          <AddProjectForm
            handleProjectSubmit={this.handleAddProject()}
            projects={projects}
            shouldRenderSubmitButton={true}
          />
        );
         
      case (modalType === "ADD_TASKS") && (elementType === "TITLE"): 
        return <h2 className="add-tasks-form-title">Add tasks for project <span>{selectedProjectName}</span></h2>
      
      case (modalType === "ADD_TASKS") && (elementType === "CONTENT"): 
       return <AddTasksFormContainer />
        
      case (modalType === "EDIT_TASK") &&  (elementType === "CONTENT"):
          return <EditTaskForm clickedTaskId={clickedTaskId} />
      
      case (modalType === "CONFIRM_EDIT_TASK") && (elementType === "CONTENT"):
        return <ConfirmEditTask {...modalProps} /> 
      default:
        return null;
    }
  }
  
  
  renderAnimatedElement(elementType) {
    const { modalType } = this.props;
    
    return (
      <ReactCSSTransitionGroup 
        transitionAppear={true}
        transitionAppearTimeout={1000}
        transitionEnter={false}
        transitionLeave={false}
        transitionName="bounceInDown"
        key={modalType + elementType}
        >
          {this.renderFormElement(elementType)}			
        </ReactCSSTransitionGroup>
      )
    }
  
  renderAnimatedForm(){
    const { isContentWaiting } = this.state;
    const { modalType } = this.props;
    
    if (isContentWaiting === true) {
      const timeoutDuration = modalType === "WELCOME" ? 1200 : 500;
      
      setTimeout(()=> this.setState({ isContentWaiting: false }), timeoutDuration);
    }
    
    return (
      <div className={`${modalType === "WELCOME" ? 'welcome' : '' } fullscreen-form`}>
        {this.renderAnimatedElement("TITLE")}
        {!isContentWaiting && this.renderAnimatedElement("CONTENT")}
      </div>
    )
  }
  
  
  render() {
    const { isModalActive, rootModalClass, toggleModal } = this.props;
    
    return (
      isModalActive &&
      <Modal 
        handleCloseButtonClick={toggleModal}
        rootModalClass={rootModalClass} 
        modalClass={""}
        shouldRender={isModalActive}
        text={""}
      >
        {this.renderAnimatedForm()}
      </Modal> 
    );
  }
}
  
const mapStateToProps = (state) => {
  const { selectedProjectId, modal, projects } = state;
  const { isModalActive, rootModalClass, modalProps, modalType } = modal;
  
  const selectedProjectName = 
  selectedProjectId
  ? projects.items.find(project => project.shortId === selectedProjectId).projectName
  : null;
  
  return {
    selectedProjectName,
    isModalActive,
    rootModalClass,
    modalProps, 
    modalType,
    projects: projects.items
  }
}

export default connect(mapStateToProps, {
  addTask,
  confirmEditTaskTime,
  changeModalType,
  postProject,
  setSelectedProject, 
  toggleModal
})(FormModal);


FormModal.propTypes = {
  hanldeFormSubmit: PropTypes.func,
  handleCloseButtonClick: PropTypes.func.isRequired,
  isModalActive: PropTypes.bool.isRequired
}
