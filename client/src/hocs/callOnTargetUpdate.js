import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default function callOnTargetUpdate(getTargetInfo, onTargetUpdate) {
  return (WrappedComponent) => {
    class BaseComponent extends Component {
      shouldComponentUpdate(nextProps) {
        const { targetValue } = this.props;

        if (targetValue === 'ADD_PROJECT') {
          // console.log(this.props.remoteSubmitForm, nextProps.remoteSubmitForm);
        }
        // console.log(this.props.form)
        return true;
      }

      componentDidUpdate(prevProps) {
        // console.log(prevProps.remoteSubmitForm, this.props.remoteSubmitForm);
        // console.log(this.props.onTargetUpdate);


        // console.log(this.props.remoteSubmitForm)
        const { targetPropKey, targetValue } = getTargetInfo(this.props);
        // console.log(this.props.form, this.props.remoteSubmitForm, 
        // (prevProps[targetPropKey] !== targetValue) && (this.props[targetPropKey] === targetValue));
        // console.log(this.props.remoteSubmitForm)
        // console.log( this.props.remoteSubmitForm, targetValue, prevProps[targetPropKey], this.props[targetPropKey])
        if ((prevProps[targetPropKey] !== targetValue) && (this.props[targetPropKey] === targetValue)) {
          // console.log('calling');
          onTargetUpdate(this.props);
        }
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }
    const mapStateToProps = (state) => { return { remoteSubmitForm: state.customForm.remoteSubmitForm }; };
    return connect(mapStateToProps)(BaseComponent);
  };
}

callOnTargetUpdate.propTypes = {
  targetValue: PropTypes.string.isRequired,
};
