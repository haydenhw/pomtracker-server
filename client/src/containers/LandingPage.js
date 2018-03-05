import React from 'react';
import PropTypes from 'prop-types';
import { routeToTimerPage } from '../helpers/route';

import LandingDescriptionList from '../components/LandingDescriptionList';
import LandingHeading from '../components/LandingHeading';
import LandingScreenshot from '../components/LandingScreenshot';
import LandingSections from '../components/LandingSections';

const landingCopy = [
  {
    title: 'Projects and Tasks',
    description: 'Supports projects with nested tasks',
  },
  {
    title: 'Fun to Use',
    description: 'Quirky animiations keep things light',
  },
  {
    title: 'Minimal Design',
    description: 'Clean, simple, easy to use interface',
  },
];

export default function LandingPage() {
  return (
    <div className="landing-page row">
      <div className="col7 col-lp-hero">
        <div className="lp-hero">
          <LandingHeading handleStartClick={routeToTimerPage} />
          <LandingDescriptionList copy={landingCopy} handleStartClick={routeToTimerPage} />
        </div>
      </div>
      <div className="col5">
        <LandingScreenshot />
        <LandingSections copy={landingCopy} />
      </div>
    </div>

  );
}

LandingPage.propTypes = {
};
