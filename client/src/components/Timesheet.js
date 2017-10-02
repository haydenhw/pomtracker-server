import React from 'react';
import PropTypes from 'prop-types';

import TimesheetColumn from './TimesheetColumn';

export default function Timesheet({ buttonText, children, handleButtonClick, titleText }) {
  return (
    <div className="timesheet">
      <div className="timesheet-title">{titleText}</div>
      <div className="timesheet-row">
        <TimesheetColumn colNumber="1" />
        <TimesheetColumn colNumber="2" />
        <TimesheetColumn colNumber="3">
          {/* <div className="timesheet-button-wrapper"> */}
          <button
            className="timesheet-add-button material-button"
            onClick={handleButtonClick}
          >
            {buttonText}
          </button>
          {/* </div> */}
        </TimesheetColumn>
      </div>
      {children}
    </div>
  );
}

Timesheet.propTypes = {
};
