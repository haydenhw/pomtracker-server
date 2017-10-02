import React from 'react';
import PropTypes from 'prop-types';

import BounceInAnimationWrapper from '../containers/BounceInAnimationWrapper';

export default function WelcomeModal(props) {
  const { handleGetStartedClick } = props;

  return (
    <div className="welcome fullscreen-container">
      <h2 className="modal-title bounceInDown-welcome">Welcome to PomTracker!</h2>
      <div className="bounceInDown-welcome-second">
        <p className="welcome-instructions">Click below to create you first project</p>
        <button className="outline-button fade-in-long-delay" onClick={handleGetStartedClick}>Get Started</button>
      </div>
    </div>
  );
}

WelcomeModal.propTypes = {
  handleGetStartedClick: PropTypes.func.isRequired,
};
