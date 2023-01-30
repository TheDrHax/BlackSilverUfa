import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
// Components
import { Container, Spinner as SpinnerComponent } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';
import Header from './header';
import Footer from './footer';
import config from '../../../../config/config.json';
import Matomo from '../../matomo';

const Layout = ({
  className,
  withFooter,
  children,
  flex,
  isLoading,
  title,
  canonicalPath,
  ...rest
}) => {
  const withFlex = flex || isLoading;

  useEffect(() => {
    if (title) {
      Matomo.trackPageView();
    }
  }, [title]);

  const fullTitle = title ? `${title} | ${config.title}` : config.title;

  return (
    <>
      {!isLoading && (
        <Helmet>
          <title>{fullTitle}</title>
          <meta property="og:title" content={fullTitle} />
          {canonicalPath && (
            <link rel="canonical" href={`${config.prefix}${canonicalPath}`} />
          )}
        </Helmet>
      )}
      <Header />
      <Container className={`main-content ${withFlex ? 'd-flex' : ''} ${className}`} {...rest}>
        {isLoading ? (
          <div className="flex-grow-1 d-flex justify-content-center align-items-center">
            <SpinnerComponent variant="primary" animation="border" size="xl" />
          </div>
        ) : children}
      </Container>
      {withFooter && <Footer />}
    </>
  );
};

Layout.propTypes = {
  flex: PropTypes.bool,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  withFooter: PropTypes.bool,
  title: PropTypes.string,
  canonicalPath: PropTypes.string,
};

Layout.defaultProps = {
  flex: false,
  isLoading: false,
  withFooter: true,
  className: '',
  title: null,
  canonicalPath: null,
};

export default Layout;
