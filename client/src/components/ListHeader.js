import React from 'react';
import PropTypes from 'prop-types';

export default function ListHeader(props) {
  const { col1Title, col2Title } = props;

  return (
    <div className="list-item list-item-header">
      <div className="timesheet-col1 timesheet-col">
        <span>{col1Title}</span>
      </div>
      <div className="timesheet-col2 timesheet-col">
        <span>{col2Title}</span>
      </div>
      <div className="timesheet-col3 timesheet-col" />
    </div>
  );
}

ListHeader.propTypes = {
  col1Title: PropTypes.string,
  col2Title: PropTypes.string,
};
