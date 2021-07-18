import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Container } from 'react-bootstrap';
import Header from './header';
import Footer from './footer';

const Layout = ({
  className,
  withFooter,
  children,
  ...rest
}) => (
  <>
    <Header />
    <Container className={`main-content ${className}`} {...rest}>
      {children}
    </Container>
    {withFooter && <Footer />}
  </>
);

Layout.propTypes = {
  className: PropTypes.string,
  withFooter: PropTypes.bool,
};

Layout.defaultProps = {
  withFooter: true,
  className: '',
};

export default Layout;
