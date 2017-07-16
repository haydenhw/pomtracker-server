import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

let RemoteSubmitForm = function(props) {
    const { children, remoteSubmitForm } = props;
    // const childProps = Object.assign({}, props, remoteSubmitForm );
    
    return React.cloneElement(children, {...props }, { remoteSubmitForm });
}

const mapStateToProps = state => {
  const { remoteSubmitForm } = state.customForm;
    
  return {
    initialState: {singleInput: 'ripper'},
    remoteSubmitForm
  }
}

export default connect(mapStateToProps)(RemoteSubmitForm);
