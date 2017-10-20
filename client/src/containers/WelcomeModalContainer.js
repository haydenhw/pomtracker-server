import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changeModalType } from '../actions/indexActions';

import WelcomeModal from '../components/WelcomeModal';

function WelcomeModalContainer(props) {
  const { changeModalType } = props;

  return (
    <WelcomeModal handleGetStartedClick={() => changeModalType('ADD_PROJECT')} />
  );
}

export default connect(null, { changeModalType })(WelcomeModalContainer);

WelcomeModalContainer.propTypes = {
  changeModalType: PropTypes.func.isRequired,
};
