import React from 'react';
import PropTypes from 'prop-types';

export default function LandingDescriptionList() {
  return (
    <ul className="lp-description-list">
      <li className="lp-description-item">
        <span className="lp-description-item-icon icon-check-square-3" />
        <span className="lp-description-item-text">
          Time tracking / pomodoro synchronization
        </span>
      </li>
      <li className="lp-description-item">
        <span className="lp-description-item-icon icon-check-square-3" />
        <span className="lp-description-item-text">
          Quirky animations keeps things fun
        </span>
      </li>
      <li className="lp-description-item">
        <span className="lp-description-item-icon icon-check-square-3" />
        <span className="lp-description-item-text">
          Clean, minimal, easy to use interface
        </span>
      </li>
    </ul>
  );
}
