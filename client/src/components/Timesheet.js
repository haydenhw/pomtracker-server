import React from 'react';
import PropTypes from 'prop-types';

import TimesheetColumn from './TimesheetColumn';

export default function Timesheet(props) {
  const { buttonText, children, className, handleButtonClick, titleText } = props;

  return (
    <div className={`timesheet ${className || ''}`}>
      <div className="timesheet-title">{titleText}</div>
      <div className="timesheet-row">
        <TimesheetColumn colNumber="1" />
        <TimesheetColumn colNumber="2" />
        <TimesheetColumn colNumber="3">
          <button
            className="timesheet-add-button material-button"
            onClick={handleButtonClick}
          >
            {buttonText}
          </button>
        </TimesheetColumn>
      </div>
      {children}
    </div>
  );
}

Timesheet.propTypes = {
  buttonText: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  handleButtonClick: PropTypes.func.isRequired,
  titleText: PropTypes.node.isRequired,
};
