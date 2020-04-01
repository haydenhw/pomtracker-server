import React from 'react';
import PropTypes from 'prop-types';

export default function Input(props) {
  const {
    input,
    meta: { error, touched },
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
        className="form-input"
        name={name}
        placeholder={placeholder}
        type={type}
      />
      {touched && error && <div className="form-error">{error}</div>}
    </div>
  );
}

Input.propTypes = {
  input: PropTypes.object,
  meta: PropTypes.object,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  shouldAutoFocus: PropTypes.bool,
  type: PropTypes.string,
};

