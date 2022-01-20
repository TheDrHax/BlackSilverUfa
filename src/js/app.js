import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouterGlobalHistory } from 'react-router-global-history';
import { Button } from 'react-bootstrap';
import { Helmet } from 'react-helmet';
// Namespace
import { common as t } from './constants/texts';
import PATHS from './constants/urls';
// Components
import { SearchPage, GamePage } from './pages';
import PlayerPage from './components/segment-player';
import { RedirectLinks, RedirectR } from './components/redirects';
import { Layout } from './components';
import DonatePage from './pages/donate-page';

const App = () => (
  <Router>
    <Helmet>
      <meta charSet="utf-8" />
    </Helmet>
    <ReactRouterGlobalHistory />
    <QueryParamProvider ReactRouterRoute={Route}>
      <Switch>
        <Route path={PATHS.PLAYER} component={PlayerPage} />
        <Route path={PATHS.GAME} component={GamePage} />
        <Route path={PATHS.LINK} component={RedirectLinks} />
        <Route path={PATHS.REDIRECT} component={RedirectR} />
        <Route path={PATHS.DONATE} component={DonatePage} />
        <Route
          exact
          path={PATHS.HOME}
          render={({ location }) => (location.hash.startsWith('#/')
            ? <Redirect to={location.hash.substring(1)} />
            : <SearchPage />)}
        />
        <Route path="*">
          <Layout flex title={t.notFoundTitle}>
            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
              <h3 className="text-white">
                {t.notFoundTitle}
              </h3>
              <Button variant="primary" as={Link} to={PATHS.HOME} className="mt-4">
                {t.returnToMain}
              </Button>
            </div>
          </Layout>
        </Route>
      </Switch>
    </QueryParamProvider>
  </Router>
);

export default App;
