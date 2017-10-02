import React from 'react';
import PropTypes from 'prop-types';

export default function ProjectHeading(props) {
  const { text, iconClass, handleClick } = props;

  return (
    <div className="project-heading-wrapper" onClick={handleClick}>
      <h2 className="project-heading">
        <span>
          {text}
          <i className={iconClass} />
        </span>
      </h2>
    </div>
  );
}

ProjectHeading.propTypes = {
  handleClick: PropTypes.string,
  iconClass: PropTypes.string,
  text: PropTypes.string.isRequired,
};
