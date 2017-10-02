import React from 'react';
import PropTypes from 'prop-types';

export default function List(props) {
  const { children, className, items, renderItem } = props;

  const list = items && items.map(renderItem);

  return (
    <div className={className || ''} >
      {children}
      {list}
    </div>
  );
}

List.propTypes = {
  items: PropTypes.array,
  wrapperClass: PropTypes.string,
  renderItem: PropTypes.func.isRequired,
};
