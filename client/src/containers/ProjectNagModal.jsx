import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';

import { closeModal } from '../actions/indexActions';

import Nag from '../components/Nag';

const handleActionButtonClick = closeModal => () => {
  closeModal(() => hashHistory.push('/projects/new'));
};

const ProjectNagModal = function({ closeModal }) {
  return (
    <Nag
      actionButtonText="ADD PROJECT"
      nagMessage="Please add a project before continuing."
      onActionButtonClick={handleActionButtonClick(closeModal)}
      title="No projects added yet"
    />
  );
};

export default connect(() => ({}), { closeModal })(ProjectNagModal);

ProjectNagModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
