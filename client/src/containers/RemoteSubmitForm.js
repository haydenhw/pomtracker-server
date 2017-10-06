import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const RemoteSubmitForm = function (props) {
  const { children, remoteSubmitForm } = props;
  // const childProps = Object.assign({}, props, remoteSubmitForm );

  return React.cloneElement(children, { ...props }, { remoteSubmitForm });
};

const mapStateToProps = (state) => {
  const { remoteSubmitForm } = state.customForm;

  return {
    remoteSubmitForm,
  };
};

export default connect(mapStateToProps)(RemoteSubmitForm);

RemoteSubmitForm.propTypes = {
  children: PropTypes.func.isRequired,
  remoteSubmitForm: PropTypes.func.isRequired
};
