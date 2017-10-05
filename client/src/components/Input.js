import React from 'react';
import PropTypes from 'prop-types';

export default function Input(props) {
  const {
    className,
    input,
    meta: { error, pristine, touched },
    name,
    placeholder,
    shouldAutoFocus,
    type,
  } = props;
  return (
    <div>
      <input
        {...input}
        autoFocus={shouldAutoFocus || false}
        autoComplete="off"
        className="form-input fullscreen-input add-project-input"
        name={name}
        placeholder={placeholder}
        type={type}
      />
      {touched && error && <div className="form-error">{error}</div>}
    </div>
  );
}

Input.propTypes = {
  className: PropTypes.string,
  input: PropTypes.object,
  meta: PropTypes.object,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  shouldAutoFocus: PropTypes.bool,
  type: PropTypes.string,
};



