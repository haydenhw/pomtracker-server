import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import { changeModalType } from '../actions/indexActions';

import FormModal from '../components/FormModal';
import EditTaskForm from '../components/EditTaskForm';

export default function EditTaskModal() {
  return (
    <EditTaskForm containerClass="normal-modal-form-container" />
  );
}
