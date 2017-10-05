import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';

import ContextMenu from '../containers/ContextMenu';

export default function Project(props) {
  const { handleMenuClick, projectData, totalTime } = props;
  const { projectName } = projectData;

  return (
    <div className="list-item">
      <span>{projectName}</span>
      <span>{totalTime}</span>
      <ContextMenu>
        <li className="popup-menu-item"><a>Edit</a></li>
        <li className="popup-menu-item"><a>Delete</a></li>
      </ContextMenu>
    </div>
  );
}

Project.propTypes = {
  handleMenuClick: PropTypes.func.isRequired,
  projectData: PropTypes.object.isRequired,
  totalTime: PropTypes.string.isRequired,
};
