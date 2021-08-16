import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Container, Spinner as SpinnerComponent } from 'react-bootstrap';
import Header from './header';
import Footer from './footer';

const Layout = ({
  className,
  withFooter,
  children,
  flex,
  isLoading,
  ...rest
}) => {
  const withFlex = flex || isLoading;
  return (
    <>
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
};

Layout.defaultProps = {
  flex: false,
  isLoading: false,
  withFooter: true,
  className: '',
};

export default Layout;
