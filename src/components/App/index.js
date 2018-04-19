import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Navigation from '../Navigation';
import Footer from '../Footer';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import UserPage from '../UserPage';
import PostPage from '../PostPage';
import Chat from '../Chat';
import AccountPage from '../Account';
import SettingsPage from '../Settings';
import CreatePostPage from '../CreatePost';
import DisplayPostsPage from '../DisplayPosts';
import OffersPage from '../OffersPage';
import SupportPage from '../Support';
import TermsPage from '../Terms';
import AboutUsPage from '../AboutUs';
import * as routes from '../../constants';

import './index.css';

const NoMatch = ({ location }) => (
  <div>
    <h3>
      No match for <code>{location.pathname}</code>
    </h3>
  </div>
);

const App = () =>
  <Router>
    <div>
    <Navigation />
      <div className="app">
        <Switch>
          <Route exact path={routes.LANDING} component={LandingPage} />
          <Route exact path={routes.SIGN_UP} component={SignUpPage} />
          <Route exact path={routes.LOGIN} component={SignInPage} />
          <Route exact path={routes.PASSWORD_FORGET} component={PasswordForgetPage} />
          <Route exact path={routes.HOME} component={HomePage} />
          <Route exact path={routes.ACCOUNT} component={AccountPage} />
          <Route exact path={routes.SETTINGS} component={SettingsPage} />
          <Route exact path={routes.CHAT} component={Chat} />
          <Route exact path={routes.CREATE_POST} component={CreatePostPage} />
          <Route exact path={routes.DISPLAY_POSTS} component={DisplayPostsPage} />
          <Route exact path={routes.SUPPORT} component={SupportPage} />
          <Route exact path={routes.TERMS} component={TermsPage} />
          <Route exact path={routes.ABOUTUS} component={AboutUsPage} />
          <Route exact path={routes.USER} component={UserPage} />
          <Route exact path={routes.POST} component={PostPage} />
          <Route exact path={routes.OFFERS} component={OffersPage} />
          <Route component={NoMatch} />
        </Switch>
        <hr/>
      </div>
      {/* <Footer/> */}
    </div>
  </Router>

export default App;
