import React from 'react';
import { render } from 'react-dom';
import { IndexRoute, Router, Route, hashHistory } from 'react-router';
import { Provider } from 'react-redux';
import TagManager from 'react-gtm-module'
import ReactGA from 'react-ga';

import store from './redux-files/store';

import App from './containers/App';
import AddProjectPage from './containers/AddProjectPage';
import EditProjectPage from './containers/EditProjectPage';
import LandingPage from './containers/LandingPage';
import ProjectsPage from './containers/ProjectsPage';
import TimerPage from './containers/TimerPage';

import './helpers/polyfill';
import './styles/index.scss';
import './styles/icons/icomoon/style.css';

if (process.env.NODE_ENV === 'production') {
  TagManager.initialize({
    gtmId: 'GTM-KJWS7WT'
  });

  ReactGA.initialize('UA-160393427-3');
}

render((
  <Provider store={store}>
    <Router history={hashHistory}>
      <Route path="/" component={LandingPage} />
      <Route path="/timer" component={App}>
        <IndexRoute component={TimerPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/projects/new" component={AddProjectPage} />
        <Route path="/projects/:projectId" component={EditProjectPage} />
      </Route>
    </Router>
  </Provider>
), document.getElementById('root'));
