import React from 'react';
import PropTypes from 'prop-types';

import LandingDescriptionList from '../components/LandingDescriptionList';
import LandingHeading from '../components/LandingHeading';
import LandingScreenshot from '../components/LandingScreenshot';
import LandingSections from '../components/LandingSections';

export default function LandingPage() {
  return (
    <div className="landing-page row">
      <div className="col6">
        <LandingHeading />
        <LandingDescriptionList />
      </div>
      <div className="col4">
        <LandingScreenshot />
        <LandingSections />
      </div>
    </div>

  );
}

LandingPage.propTypes = {
};
