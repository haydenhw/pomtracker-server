import React, { Component } from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import { connect } from 'react-redux';

import { changeActiveContextMenu } from '../actions/indexActions';
import Popup from '../components/PopupMenu';
import PopupMenuContent from '../components/PopupMenuContent';
import PopupMenuTrigger from '../components/PopupMenuTrigger';

class ContextMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isActive: false,
    };

    this.handleBodyClick = this.handleBodyClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isActive === true && this.state.isActive === false) {
      document.body.removeEventListener('click', this.handleBodyClick);
    }
  }

  bindBodyClickHandler() {
    document.body.addEventListener('click', this.handleBodyClick);
  }

  handleClick = (evt) => {
    evt.stopPropagation();

    const { onMenuClick, parentId } = this.props;

    onMenuClick
      ? onMenuClick(parentId)
      : this.setState({ isActive: true });

    this.bindBodyClickHandler();
  }

  handleBodyClick(evt) {
    const { onMenuClick } = this.props;
    const targetClassName = evt.target.className;

    if (
      targetClassName !== 'task-select option' &&
      targetClassName !== 'task-select option-item'
    ) {
      onMenuClick
        ? onMenuClick(null)
        : this.setState({ isActive: false });

      document.body.removeEventListener('click', this.handleBodyClick);
    }
  }

  render() {
    const { activeContextMenuParentId, children, className, parentId } = this.props;
    const { isActive } = this.state;

    return (
      <Popup className={className}>
        <div className="popup-wrapper">
          <PopupMenuTrigger handleClick={this.handleClick}>
            <div className="list-item-button list-item-outline-button">
              <span className="icon-dots" />
            </div>
          </PopupMenuTrigger>
          <PopupMenuContent isActive={activeContextMenuParentId ? activeContextMenuParentId === parentId : isActive}>
            {children}
          </PopupMenuContent>
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = (state) => {
  const { editMenu } = state;

  return {
    activeContextMenuParentId: editMenu.activeParentId,
  };
};

export default connect(mapStateToProps, { changeActiveContextMenu })(ContextMenu);

ContextMenu.propTypes = {
  activeContextMenuParentId: PropTypes.string,
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  onMenuClick: PropTypes.func.isRequired,
  parentId: PropTypes.string.isRequired
};
