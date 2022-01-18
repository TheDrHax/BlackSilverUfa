import React from 'react';
// Components
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import HeaderQuickSearch from './header-quick-search';
// Namespace
import PATHS from '../../constants/urls';
import config from '../../../../config/config.json';
// Hooks
import { useDataStore } from '../../hooks/use-data-store';

const Header = () => {
  const { isReady, data: { index, segments } } = useDataStore();
  return (
    <>
      <div className="navbar-space">{/* floating navbar workaround */}</div>
      <Navbar variant="dark" expand="md" fixed="top" collapseOnSelect>
        <Container>
          <Navbar.Brand as={Link} to={PATHS.HOME} className="d-flex align-items-center">
            {config.title}
          </Navbar.Brand>
          <Navbar.Toggle />

          <Navbar.Collapse id="navbar-collapse">
            <Nav.Link as={Link} to={PATHS.DONATE} className="text-white mr-auto">
              Поддержать проект
            </Nav.Link>
            <Nav className="mr-auto" />
            {isReady && <HeaderQuickSearch indexStore={index} segmentsStore={segments} />}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
