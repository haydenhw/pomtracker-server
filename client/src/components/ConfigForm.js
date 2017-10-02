import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';


const renderField = (props) => {
  const { input, type, meta: { touched, error } } = props;
  return (
    <div>
      <input
        {...input}
        autoFocus
        autoComplete="off"
        className="form-input fullscreen-input add-project-input"
        placeholder={'Project Name'}
        type={type}
      />
      {touched && error && <div className="form-error">{error}</div>}
    </div>
  );
};

const ConfigForm = function ConfigForm(props) {
  const {
    handleFormSubmit,
    handleSubmit,
    title,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      {title &&
      <h2 className="form-title bounceInDown">
        {title}
      </h2>
      }
      <div className="bounceInDown-second">
        <Field component="select" name="alarmSound">
          <option value="sound/Old-clock-ringing-short.mp3">ringer</option>
          <option value="sound/endSound.mp3">electronic</option>
        </Field>
      </div>
      <button className="fade\-in\-medium\-delayoutline-button" onClick={handleSubmit(handleFormSubmit)}>Submit</button>
    </form>
  );
};

export default reduxForm({
  form: 'config',
})(ConfigForm);

// ConfigForm.propTypes = {
//   handleProjectSubmit: PropTypes.func,
//   handleSubmit: PropTypes.func,
// }
