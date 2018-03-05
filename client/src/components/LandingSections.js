import React from 'react';
import PropTypes from 'prop-types';

export default function LandingSections() {
  return (
    <div>
      <section className="lp-section">
        <h1 className="lp-heading">Seemless synchronization</h1>
        <p className="lp-sub-heading">Time tracking stops automatically when pomodoro sessions end</p>
      </section>
      <section className="lp-section">
        <h1 className="lp-heading">Fun to use</h1>
        <p className="lp-sub-heading">Quirky animations keep things light</p>
      </section>
      <section className="lp-section">
        <h1 className="lp-heading">Minimal Design</h1>
        <p className="lp-sub-heading">Clean, simple, easy to use interface</p>
      </section>
    </div>
  );
}
