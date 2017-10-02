import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import randomColor from 'randomcolor';
import shortid from 'shortid';

import { secondsToHMMSS } from 'helpers/time';
import { closeModal, updateTask, toggleEditTaskForm } from '../actions/indexActions';

import ContextMenu from '../containers/ContextMenu';
import ListItem from './ListItem';
import TimesheetColumn from './TimesheetColumn';

export default function TimesheetListItem(props) {
  const { actionIconClass, children, isActive, isSelected, handleItemClick, handlePlayClick, time, title } = props;
  const letterIconColor = randomColor({
    // luminosity: 'light',
    hue: 'purple',
  });

  return (
    <ListItem
      key={shortid.generate()}
      isActive={isActive}
      isSelected={isSelected}
      handleClick={handleItemClick}
    >
      <TimesheetColumn colNumber="1">
        {/* <div className="list-item-button" style={{ "backgroundColor": letterIconColor ,  "borderColor": letterIconColor }}> */}
        <div className="list-item-button">
          <span className="list-item-letter-icon"> {title[0].toUpperCase()}</span>
        </div>
        {/* <FontAwesome className="list-item-icon list-item-task-icon" name='check-circle'></FontAwesome>   */}
      </TimesheetColumn>
      <TimesheetColumn colNumber="2">
        <div>
          <h2 className="timesheet-col-title">{title}</h2>
          <div className="timesheet-col-time">{secondsToHMMSS(time)}</div>
        </div>
      </TimesheetColumn>

      <TimesheetColumn colNumber="3">
        <div
          className={`list-item-button list-item-${isActive ? 'stop' : 'play'} 
          ${isActive ? 'active' : ''}`}
          onClick={handlePlayClick}
        >
          <span className={`icon-${isActive ? 'stop' : actionIconClass}`} />
        </div>
        { children }
      </TimesheetColumn>
      <TimesheetColumn colNumber="4" />
    </ListItem>
  );
}
