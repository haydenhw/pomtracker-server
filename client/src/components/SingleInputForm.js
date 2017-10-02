import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form';

import callOnTargetUpdate from '../hocs/callOnTargetUpdate';

import Input from './Input';

const dummySubmit = (evt) => {
  evt.preventDefault();
  return false;
};

let SingleInputForm = function SingleInputForm(props) {
  const {
    childContainerClass,
    handleFormSubmit,
    handleSubmit,
    fieldAnimationName,
    parentContainerClass,
    placeholder,
    isModalActive,
    isOnlyInput,
    shouldRenderSubmitButton,
    title,
    titleAnimationName,
    titleName,
  } = props;

  return (
    <div className={parentContainerClass}>
      <div className={childContainerClass}>
        <form onSubmit={isOnlyInput ? handleSubmit(handleFormSubmit) : dummySubmit}>
          {title &&
            <h2 className={`form-title ${titleAnimationName || ''}`}>
              {title}
              {titleName && <span className="grey-title-text">{titleName}</span>}
            </h2>
          }
          {/* <div className="fieldAnimationName"> */}
          <div className={fieldAnimationName || ''}>
            <Field
              component={Input}
              name="singleInput"
              placeholder="Project Name"
              type="text"
              shouldAutoFocus
            />
          </div>
        </form>
      </div>
      {shouldRenderSubmitButton &&
        <button className="fade-in-medium-delay outline-button modal-button-bottom-right" onClick={handleSubmit(handleFormSubmit)}>Continue</button>
      }
    </div>
  );
};

const targetInfo = (props) => {
  return {
    targetValue: 'ADD_PROJECT',
    targetPropKey: 'remoteSubmitForm',
  };
};

const onTargetUpdate = (props) => {
  const { handleSubmit, onTargetUpdate } = props;
  handleSubmit(onTargetUpdate)();
};

SingleInputForm = callOnTargetUpdate(targetInfo, onTargetUpdate)(SingleInputForm);

export default reduxForm({
  form: 'singleInput',
})(SingleInputForm);

