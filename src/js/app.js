import React, { StrictMode, Suspense } from 'react';
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
import { Helmet, HelmetProvider } from 'react-helmet-async';
import flowRight from 'lodash/flowRight';
// Namespace
import { common as t } from './constants/texts';
import PATHS from './constants/urls';
// Components
import { SearchPage, GamePage, MainPage, DonatePage } from './pages';
import { RedirectLinks, RedirectR } from './components/redirects';
import { Layout } from './components';

const PlayerPage = React.lazy(() => import('./components/segment-player'));

const Providers = flowRight([
  (c) => <StrictMode>{c}</StrictMode>,
  (c) => <HelmetProvider>{c}</HelmetProvider>,
  (c) => <Router>{c}</Router>,
  (c) => <Suspense fallback={<Layout isLoading />}>{c}</Suspense>,
  (c) => <QueryParamProvider ReactRouterRoute={Route}>{c}</QueryParamProvider>,
  ({ children }) => children,
]);

const App = () => (
  <Providers>
    <ReactRouterGlobalHistory />
    <Helmet>
      <meta charSet="utf-8" />
    </Helmet>
    <Switch>
      <Route path={PATHS.PLAYER} component={PlayerPage} />
      <Route path={PATHS.SEARCH} component={SearchPage} />
      <Route path={PATHS.GAME} component={GamePage} />
      <Route path={PATHS.LINK} component={RedirectLinks} />
      <Route path={PATHS.REDIRECT} component={RedirectR} />
      <Route path={PATHS.DONATE} component={DonatePage} />
      <Route
        exact
        path={PATHS.HOME}
        render={({ location }) => {
          if (location.hash.startsWith('#/')) {
            return <Redirect to={location.hash.substring(1)} />;
          }

          const search = new URLSearchParams(location.search);

          if (search.get('q')) {
            return <Redirect to={PATHS.SEARCH + location.search} />;
          }

          return <MainPage />;
        }}
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
  </Providers>
);

export default App;
