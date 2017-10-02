import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

export default function TaskListItem(props) {
  const { handleClick, isActive, isSelected, taskName, taskTime } = props;

  return (
    <div className={`list-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
      <div className="timesheet-col1 timesheet-col">
        <FontAwesome className="timer-settings-icon" name="gear" />
      </div>
      <div className="timesheet-col2 timesheet-col">
        <h2>{taskName}</h2>
        <div>{taskTime}</div>
      </div>
      <div className="timesheet-col3 timesheet-col">
        <FontAwesome className="timer-settings-icon" name="gear" />
        {props.children}
      </div>
    </div>
  );
}

TaskListItem.propTypes = {
  col1Text: PropTypes.string,
  col2Text: PropTypes.string,
};
