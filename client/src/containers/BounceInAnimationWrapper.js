// // this is not in use and can be deleted
import React from 'react';
import PropTypes from 'prop-types';

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import shortid from 'shortid';

export default function BounceInAnimationWrapper(props) {
  const { children } = props;

  return (
    <ReactCSSTransitionGroup
      transitionAppear
      transitionAppearTimeout={1000}
      transitionEnter={false}
      transitionLeave={false}
      transitionName="bounceInDown"
      key={shortid}
    >
      {children}
    </ReactCSSTransitionGroup>
  );
}

BounceInAnimationWrapper.propTypes = {
  children: PropTypes.object.isRequired,
};
