import React from 'react';
import PropTypes from 'prop-types';

export default function Nav(props) {
  const { activeLink, handleTimerLinkClick, handleProjectsLinkClck } = props;

  return (
    <nav>
      <div className="nav-logo-wrapper">
        <img className="nav-logo-image" src="images/black-white-tomato-timer.png" alt="tomato timer logo" />
        <h1 className="nav-logo-text"><span>Pom</span><span className="nav-logo-text-bold">Tracker</span></h1>
      </div>
      <div className="nav-link-wrapper">
        <a
          className={`nav-link ${activeLink === 'TIMER' ? 'active-link' : ''}`}
          onClick={handleTimerLinkClick}
        >
          <span className="nav-link-name nav-timer-link-name">
                Timer
          </span>
        </a>
      </div>

      <div className="nav-link-wrapper">
        <a
          className={`nav-link ${activeLink === 'PROJECTS' ? 'active-link' : ''}`}
          onClick={handleProjectsLinkClck}
        >
          <span className="nav-link-name">
              Projects
          </span>
        </a>
      </div>
    </nav>
  );
}

Nav.propTypes = {
};
