import React from 'react';
import PropTypes from 'prop-types';

export default function Confirm({ onCancel, onDangerClick, onDangerText, title }) {

  return(
    <div className="confirm">
      {title}
      <p className="confirm-danger-text">{onDangerText}</p>
      <div className="confirm-button-group">
        <button className="confirm-button outline-button cancel" onClick={onCancel}>Cancel</button>
        <button className="confirm-button outline-button confirm" onClick={onDangerClick}>Confirm</button>
      </div>
    </div>
  );
}

Confirm.propTypes = {
}
