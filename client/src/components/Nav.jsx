import React from 'react';
import PropTypes from 'prop-types';

export default function Nav(props) {
  const { activeLink, handleTimerLinkClick, handleProjectsLinkClick } = props;

  return (
    <nav className="nav">
      <div className="nav-logo-wrapper">
        <h1 className="nav-logo-text">PomTracker</h1>
      </div>
      <div className="nav-link-wrapper">
        <a
          className={`nav-link ${activeLink === 'TIMER' ? 'active-link' : ''}`}
          onClick={handleTimerLinkClick}
          role="link"
          tabIndex={0}
        >
          <span className="nav-link-name nav-timer-link-name">
                Timer
          </span>
        </a>
      </div>

      <div className="nav-link-wrapper">
        <a
          className={`nav-link ${activeLink === 'PROJECTS' ? 'active-link' : ''}`}
          onClick={handleProjectsLinkClick}
          role="link"
          tabIndex={0}
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
  activeLink: PropTypes.string.isRequired,
  handleTimerLinkClick: PropTypes.func.isRequired,
  handleProjectsLinkClick: PropTypes.func.isRequired,
};
