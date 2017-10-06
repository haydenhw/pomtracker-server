import React from 'react';
import PropTypes from 'prop-types';

export default function Nag({ onCancel, onAccept, nagMessage, title }) {
  return (
    <div className="nag">
      <h2>{title}</h2>
      <p className="danger-text">{nagMessage}</p>
      <button className="material-button" onClick={onAccept}>ADD PROJECT</button>
    </div>
  );
}

Nag.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onAccept: PropTypes.func.isRequired,
  nagMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
