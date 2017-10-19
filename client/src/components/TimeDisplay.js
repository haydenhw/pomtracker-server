import React from 'react';
import PropTypes from 'prop-types';
import CircularProgressbar from 'react-circular-progressbar';

import { secondsToMSS } from '../helpers/time';
import { showProgressBar, devStyle } from '../srcConfig/devSettings';

import EditInlineText from '../containers/EditInlineText';

export default function TimeDisplay(props) {
  const {
    handleButtonClick,
    isTimerActive,
    isTimerControlActive,
    setStartTime,
    startCount,
    title,
    time,
  } = props;

  const progressPercentage = Math.round((1 - (time / startCount)) * 100);
  const displayTime = time || startCount;

  return (
    <div className="timer">
      <div className="progress-bar-container" />
      {showProgressBar && <CircularProgressbar
        initialAnimation
        percentage={progressPercentage}
        strokeWidth={4}
        textForPercentage={(pct) => ''}
      />}
      <div>{title}</div>
      <div style={devStyle || null} className="timer-content">
        <EditInlineText className={`edit-time ${isTimerActive ? 'fade-in-fast' : 'hide'}`} handleChange={setStartTime} text={secondsToMSS(displayTime)} />
        <div
          className={`timer-control ${isTimerControlActive ? '' : 'disabled'} `}
          onClick={isTimerControlActive && handleButtonClick}
        >
          <div className={`${isTimerActive ? 'icon-stop-rounded' : 'icon-play-rounded'}`} />
        </div>
      </div>
    </div>
  );
}

TimeDisplay.propTypes = {
  handleButtonClick: PropTypes.func.isRequired,
  isTimerActive: PropTypes.bool,
  isTimerControlActive: PropTypes.bool,
  setStartTime: PropTypes.func.isRequired,
  startCount: PropTypes.number.isRequired,
  title: PropTypes.string,
  time: PropTypes.number,
};
