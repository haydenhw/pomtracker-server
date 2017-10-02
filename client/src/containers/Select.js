import React, { Component } from 'react';
import PropTypes from 'prop-types';
import shortid from 'shortid';

import PopupMenu from '../components/PopupMenu';
import PopupMenuTrigger from '../components/PopupMenuTrigger';
import PopupMenuContent from '../components/PopupMenuContent';

export default class Select extends Component {
  constructor() {
    super();

    this.state = {
      isActive: false,
    };

    this.handleBodyClick = this.handleBodyClick.bind(this);
    this.toggleIsActive = this.toggleIsActive.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isActive === true && this.state.isActive === false) {
      document.body.removeEventListener('click', this.handleBodyClick);
    }
  }

  toggleIsActive() {
    const { isActive } = this.state;

    document.body.addEventListener('click', this.handleBodyClick);
    this.setState({ isActive: !isActive });
  }

  handleBodyClick(evt) {
    const targetClassNames = evt.target.className.split(' ');

    if (
      targetClassNames.indexOf('option') === -1 &&
      targetClassNames.indexOf('option-item') === -1
    ) {
      this.setState({ isActive: false });
    }
  }


  handleOptionClick = (optionId) => {
    return () => {
      const { handleOptionClick } = this.props;

      handleOptionClick(optionId);
      this.toggleIsActive();
    };
  }


  renderOptions() {
    const { items, className } = this.props;

    return items.map((item) => {
      return (
        <li key={shortid.generate()} className={`${className || ''} option`} onClick={this.handleOptionClick(item.id)}>
          <span className={`${className || ''} option-item`}>{item.name}</span>
        </li>
      );
    });
  }

  renderTest() {
    if (this.state.isActive) {
      return <div className="trans-test" />;
    }

    return null;
  }

  render() {
    const { isActive } = this.state;
    const { className } = this.props;

    return (
      <PopupMenu className={`${className || ''} select`}>
        <div className="popup-wrapper">
          <PopupMenuTrigger handleClick={this.toggleIsActive}>
            {this.props.children}
          </PopupMenuTrigger>
          <PopupMenuContent isActive={isActive}>
            {this.renderOptions()}
          </PopupMenuContent>
        </div>
      </PopupMenu>
    );
  }
}

Select.propTypes = {
  className: PropTypes.string,
  items: PropTypes.array.isRequired,
};

