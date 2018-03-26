import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import Notification from 'react-web-notification';

import { routeToProjectsPage, routeToTimerPage } from '../helpers/route';
import { changeActiveLink, fetchProjects, handleExistingUserVisit, handleNewUserVisit, toggleProjectNagModal } from '../actions/indexActions';
import { doesUserExist, isJWTExpired, getUser, getJWT, clearUser, clearJWT  } from 'helpers/users';

import Nav from '../components/Nav';


class App extends Component {
  constructor() {
    super();

    this.state = {
      showNotification: true,
    };
  }

  componentDidMount() {
    // const { fetchProjects } = this.props;
    const { handleNewUserVisit, handleExistingUserVisit } = this.props;

    const jwt = getJWT();
    const user = getUser();

    doesUserExist()
      ? handleExistingUserVisit(jwt, user)
      : handleNewUserVisit();

    // fetchProjects();
  }

  handleTimerLinkClick = () => {
    const { projects, toggleProjectNagModal } = this.props;

    projects.length ? routeToTimerPage() : toggleProjectNagModal();
  }

  render() {
    const { hasFetched, isDesktopNotificationActive, location } = this.props;
    const { pathname } = location;
    const isProjectRoute = /projects/.test(pathname);

    return (
      <div>
        <Nav
          activeLink={isProjectRoute ? 'PROJECTS' : 'TIMER'}
          handleTimerLinkClick={this.handleTimerLinkClick}
          handleProjectsLinkClck={routeToProjectsPage}
          isProjectRoute={isProjectRoute}
        />
        {hasFetched
          ? this.props.children
          : <div className="loader">Loading...</div>
        }
        {isDesktopNotificationActive
          && <Notification
            title="Time's Up!"
            ignore={false}
            options={{ icon: 'images/tomato-timer.png' }}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { projects, timer } = state;
  const { hasFetched } = projects;
  const { isDesktopNotificationActive } = timer;

  return {
    hasFetched,
    isDesktopNotificationActive,
    projects: projects.items,
  };
};

export default connect(mapStateToProps, {
  changeActiveLink,
  fetchProjects,
  toggleProjectNagModal,
  handleExistingUserVisit,
  handleNewUserVisit,
},
)(App);

App.propTypes = {
  children: PropTypes.node.isRequired,
  fetchProjects: PropTypes.func.isRequired,
  hasFetched: PropTypes.bool.isRequired,
  isDesktopNotificationActive: PropTypes.bool,
  location: PropTypes.object.isRequired,
  projects: PropTypes.array.isRequired,
  toggleProjectNagModal: PropTypes.func.isRequired,
};
