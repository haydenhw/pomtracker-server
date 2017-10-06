import React from 'react';
import PropTypes from 'prop-types';
import { hashHistory } from 'react-router';

import Nag from '../components/Nag';
import Modal from './Modal';

export default function ProjectNagModal() {
  return (
    <Nag
      actionButtonText="ADD PROJECT"
      nagMessage="Please add a project before continuing."
      onActionButtonClick={() => { return hashHistory.push('/projects/new'); }}
      title="No projects added yet"
    />
  );
}
