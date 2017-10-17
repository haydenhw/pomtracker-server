import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
  decrementTimer,
  handleTimerComplete,
  incrementTaskTime,
  resetTimer,
  setIntervalId,
  setStartTime,
  toggleTimer,
} from '../actions/indexActions';

import TimeDisplay from '../components/TimeDisplay';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentCount: props.startCount,
      intervalId: null,
    };
  }

  componentWillMount() {
    const { intervalId, isTimerActive } = this.props;

    if (isTimerActive === false) {
      clearInterval(intervalId);
    }
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.isTimerActive !== nextProps.isTimerActive) && nextProps.isTimerActive) {
      const { selectedTaskId, setActiveTask, setIntervalId } = this.props;
      const intervalId = setInterval(this.timer.bind(this), 1000);

      setIntervalId(intervalId);

      setActiveTask(selectedTaskId);
    }

    if ((this.props.isTimerActive !== nextProps.isTimerActive) && !nextProps.isTimerActive) {
      const { intervalId } = this.props;

      clearInterval(intervalId);
    }
  }

  doesSelectedTaskExist() {
    const { selectedTaskId, tasks } = this.props;
    const taskIds = tasks.map((task) => { return task.shortId; });

    return taskIds.includes(selectedTaskId);
  }

  timer() {
    const {
      alarmSoundSrc,
      decrementTimer,
      handleTimerComplete,
      incrementTaskTime,
      remainingTime,
      selectedProject,
      selectedTaskId,
      setActiveTask,
    } = this.props;

    const { intervalId } = this.props;
    const activeTask = selectedProject.tasks.find((task) => { return task.shortId === selectedTaskId; });

    incrementTaskTime(selectedProject, activeTask);
    decrementTimer();

    if (remainingTime < 1) {
      const audio = new Audio(alarmSoundSrc);
      audio.play();

      clearInterval(intervalId);
      handleTimerComplete();
      setActiveTask(null);
    }
  }

  handleSetStartTime = (selectedTaskId) => {
    return (newTime) => {
      const { selectedTaskId, setStartTime } = this.props;
      const shouldToggleTimer = Boolean(selectedTaskId);

      setStartTime(newTime, shouldToggleTimer);
    };
  }

  render() {
    const {
      isTimerActive,
      remainingTime,
      startTime,
      toggleTimer,
      selectedTaskId,
      task,
    } = this.props;

    return (
      <div>
        <TimeDisplay
          isTimerActive={isTimerActive}
          isTimerControlActive={this.doesSelectedTaskExist()}
          setStartTime={this.handleSetStartTime(selectedTaskId)}
          startCount={startTime}
          time={remainingTime}
          title={task}
          handleButtonClick={toggleTimer}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { config, projects, timer } = state;
  const { selectedProjectId } = projects;
  const { alarmSoundSrc } = config;
  const { intervalId, isTimerActive, remainingTime, startTime } = timer;
  const selectedProject = projects.items.find((project) => { return project.shortId === selectedProjectId; });

  return {
    alarmSoundSrc,
    intervalId,
    isTimerActive,
    remainingTime,
    selectedProject,
    startTime,
    projects: projects.items,
  };
};

export default connect(mapStateToProps, {
  decrementTimer,
  handleTimerComplete,
  incrementTaskTime,
  resetTimer,
  setIntervalId,
  setStartTime,
  toggleTimer,
})(Timer);

Timer.propTypes = {
  alarmSoundSrc: PropTypes.string.isRequired,
  decrementTimer: PropTypes.func.isRequired,
  handleTimerComplete: PropTypes.func.isRequired,
  incrementTaskTime: PropTypes.func.isRequired,
  intervalId: PropTypes.number,
  isTimerActive: PropTypes.bool,
  remainingTime: PropTypes.number,
  resetTimer: PropTypes.func.isRequired,
  selectedProject: PropTypes.object,
  selectedTaskId: PropTypes.string,
  setActiveTask: PropTypes.func.isRequired,
  setIntervalId: PropTypes.func.isRequired,
  setStartTime: PropTypes.func.isRequired,
  startCount: PropTypes.number,
  startTime: PropTypes.number.isRequired,
  task: PropTypes.object,
  tasks: PropTypes.array.isRequired,
  toggleTimer: PropTypes.func.isRequired,
};
