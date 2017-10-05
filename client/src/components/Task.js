import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import { secondsToHMMSS } from '../helpers/time';

import ContextMenu from '../containers/ContextMenu';

export default function Task(props) {
  const { taskData } = props;
  const { taskName, recordedTime } = taskData;

  return (
    <div className="list-item">
      <div className="timesheet-col timesheet-col1">
        <FontAwesome className="timer-settings-icon" name="gear" />
      </div>
      <div className="timesheet-col timesheet-col2">
        <h2>{taskName}</h2>
        <div>{secondsToHMMSS(recordedTime)}</div>
      </div>
      <div className="timesheet-col timesheet-col3">
        <FontAwesome className="timer-settings-icon" name="gear" />
      </div>
    </div>
  );
}

Task.propTypes = {
  taskData: PropTypes.object.isRequired,
};
