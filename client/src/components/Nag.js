import React from 'react';
import PropTypes from 'prop-types';

export default function Nag({ actionButtonText, className, nagMessage, onActionButtonClick, title }) {
  return (
    <div className={`nag ${className || ''}`}>
      {title && <h2>{title}</h2>}
      <span className="nag-message">{nagMessage}</span>
      <div className="nag-button-wrapper">
        <button className="nag-add-button material-button" onClick={onActionButtonClick}>{actionButtonText}</button>
      </div>
    </div>
  );
}

Nag.propTypes = {
  actionButtonText: PropTypes.string.isRequired,
  nagMessage: PropTypes.node.isRequired,
  onActionButtonClick: PropTypes.func.isRequired,
  title: PropTypes.string,
};
