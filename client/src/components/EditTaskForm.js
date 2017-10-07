// refactor to fucntional/presentational Component. Pass submit handler from modal
import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';

import Input from './Input';

let EditTaskForm = function (props) {
  const { containerClass, handleEditTaskSubmit, handleSubmit, initialValues } = this.props;
  
  return (
    <div className="bounceInDown">
      <div className={`form-container ${containerClass || ''}`}>
        <h2 className="form-title">Edit Task</h2>
        <form className="form" onSubmit={handleSubmit(handleEditTaskSubmit)}>
          <div className="form-field-wrapper">
            <label htmlFor="task name">Task Name</label>
            <Field
              name="taskName"
              component={Input}
              shouldAutoFocus
              type="text"
            />
          </div>
          <div className="form-field-wrapper">
            <label htmlFor="loged time">Logged Time: {initialValues.recordedTime}</label>
            <Field
              name="newTime"
              component={Input}
              type="text"
            />
          </div>
        </form>
      </div>
      
      <button
        className="fade-in-medium-delay outline-button modal-button-bottom-right"
        onClick={handleSubmit(handleEditTaskSubmit)}
        type="submit">Submit</button>
      </div>
  );
};

EditTaskForm = reduxForm({
  form: 'EditTaskForm', 
})(EditTaskForm);

export default EditTaskForm;

EditTaskForm.propTypes = {
  closeModal: PropTypes.func,
  confirmEditTask: PropTypes.func,
  containerClass: PropTypes.string,
  initialValues: PropTypes.string,
  selectedProject: PropTypes.object,
  selectedTask: PropTypes.object,
  taskNames: PropTypes.array,
  updateTask: PropTypes.string,
};
