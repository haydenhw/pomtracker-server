import React from 'react';
import PropTypes from 'prop-types';

export default function Project(props) {
  const { handleMenuClick ,projectData, totalTime } = props;
  const { projectName } = projectData;
  
  return(
    <div className="list-item">
      <span>{projectName}</span>
      <span>{totalTime}</span>
      <button onClick={handleMenuClick}>Edit</button>
    </div>
  );
}

Project.propTypes = {
  handleMenuClick: PropTypes.func.isRequired,
  projectData: PropTypes.object.isRequired
}