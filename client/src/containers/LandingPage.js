import React from 'react';
import PropTypes from 'prop-types';
import { routeToTimerPage } from '../helpers/route';

import LandingDescriptionList from '../components/LandingDescriptionList';
import LandingHeading from '../components/LandingHeading';
import LandingScreenshot from '../components/LandingScreenshot';
import LandingSections from '../components/LandingSections';

export default function LandingPage() {
  return (
    <div className="landing-page row">
      <div className="col7 col-lp-hero">
        <div className="lp-hero">
          <LandingHeading handleStartClick={routeToTimerPage} />
          <LandingDescriptionList handleStartClick={routeToTimerPage} />
        </div>
      </div>
      <div className="col5">
        <LandingScreenshot />
        <LandingSections />
      </div>
    </div>

  );
}

LandingPage.propTypes = {
};
