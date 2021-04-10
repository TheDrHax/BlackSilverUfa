import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { ReactRouterGlobalHistory } from 'react-router-global-history';
import { Button } from 'react-bootstrap';
// Namespace
import t from './constants/texts';
import PATHS from './constants/urls';
// Components
import HomePage from './components/interactive-search';
import GamePage from './components/game';
import PlayerPage from './components/segment-player';
import { RedirectLinks, RedirectR } from './components/redirects';
import BasePage from './components/base-page';

const App = () => (
  <Router>
    <ReactRouterGlobalHistory />
    <Switch>
      <Route path={PATHS.PLAYER} component={PlayerPage} />
      <Route path={PATHS.GAME} component={GamePage} />
      <Route path={PATHS.LINK} component={RedirectLinks} />
      <Route path={PATHS.REDIRECT} component={RedirectR} />
      <Route
        exact
        path={PATHS.HOME}
        render={({ location }) => {
          if (location.hash.startsWith('#/')) {
            return <Redirect to={location.hash.substring(1)} />;
          } else {
            return <HomePage />;
          }
        }}
      />
      <Route path="*">
        <BasePage flex>
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <h3 className="text-white">
              {t.notFoundTitle}
            </h3>
            <Button variant="primary" as={Link} to={PATHS.HOME} className="mt-4">
              {t.returnToMain}
            </Button>
          </div>
        </BasePage>
      </Route>
    </Switch>
  </Router>
);

export default App;
