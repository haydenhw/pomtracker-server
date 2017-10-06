 
// extract nav presentational component
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import Notification from 'react-web-notification';

import { routeToProjectsPage, routeToTimerPage } from 'helpers/route';
import { changeActiveLink, fetchProjects, toggleProjectNagModal } from '../actions/indexActions';

import Nav from '../components/Nav';

class App extends Component {
  constructor() {
    super();

    this.state = {
      showNotification: true,
    };
  }

  componentDidMount() {
    const { fetchProjects } = this.props;

    fetchProjects();
    // const { location } = this.props;
    // const pathName = location.pathname;
  }

  handleTimerLinkClick() {
    const { projects, toggleProjectNagModal } = this.props;

    projects.length ? routeToTimerPage() : toggleProjectNagModal();
  }

  render() {
    const { isDesktopNotificationActive, location } = this.props;
    const pathName = location.pathname;
    const isProjectRoute = /projects/.test(pathName);

    return (
      // <div className={`${(pathName === '/' || pathName === '/projects') ? 'main-page' : '' }`}>
      <div>
        <Nav
          activeLink={isProjectRoute ? 'PROJECTS' : 'TIMER'}
          handleTimerLinkClick={this.handleTimerLinkClick.bind(this)}
          handleProjectsLinkClck={routeToProjectsPage}
          isProjectRoute={isProjectRoute}
        />
        {this.props.children}
        {isDesktopNotificationActive
          && <Notification
            title="Time's Up!"
            ignore={false}
            options={{ icon: 'images/tomato-timer.png' }}
          />}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { projects, timer } = state;
  const { isDesktopNotificationActive } = timer;

  return {
    isDesktopNotificationActive,
    projects: projects.items,
  };
};

export default connect(mapStateToProps, {
  changeActiveLink,
  fetchProjects,
  toggleProjectNagModal,
},
)(App);

// App.propTypes = {
//   children: propTypes.array.isRequired,
//   projects: propTypes.array.isRequired,
//   toggleProjectNagModal: propTypes.func.isRequired,
//   fetchProjects: propTypes.func.isRequired, 
//   isDesktopNotificationActive: propTypes.bool,
//   location: propTypes.object.isRequired,
// };
