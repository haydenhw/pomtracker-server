import React from 'react';
import PropTypes from 'prop-types';


export default function ListItem({ children, handleClick, isActive, isSelected }) {
  return (
    <div className={`list-item ${isActive ? 'active' : ''} ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
      {children}
    </div>
  );
}

ListItem.propTypes = {
  col1Text: PropTypes.string,
  col2Text: PropTypes.string,
};
