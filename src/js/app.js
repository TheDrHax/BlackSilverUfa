import React, { Suspense } from 'react';
import {
  Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter5Adapter } from 'use-query-params/adapters/react-router-5';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import flowRight from 'lodash/flowRight';
import history from './utils/history';
// Namespace
import PATHS from './constants/urls';
// Components
import { MainPage, GamePage, DonatePage, ErrorPage } from './pages';
import { RedirectLinks, RedirectR } from './components/redirects';
import { Layout } from './components';

const PlayerPage = React.lazy(() => import('./components/segment-player'));
const SearchPage = React.lazy(() => import('./pages/search-page'));

const Providers = flowRight([
  (c) => <HelmetProvider>{c}</HelmetProvider>,
  (c) => <Router history={history}>{c}</Router>,
  (c) => <Suspense fallback={<Layout isLoading />}>{c}</Suspense>,
  (c) => <QueryParamProvider adapter={ReactRouter5Adapter}>{c}</QueryParamProvider>,
  ({ children }) => children,
]);

const App = () => (
  <Providers>
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
      <Route path="*" component={ErrorPage} />
    </Switch>
  </Providers>
);

export default App;
