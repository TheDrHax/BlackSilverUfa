import React, { useState } from 'react';
// Components
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ClickAwayListener from 'react-click-away-listener';
import HeaderQuickSearch from './header-quick-search';
// Namespace
import PATHS from '../../constants/urls';
import config from '../../../../config/config.json';
// Hooks
import { useDataStore } from '../../hooks/use-data-store';

const Header = () => {
  const [{ index, segments }, isReady] = useDataStore();
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <div className="navbar-space">{/* floating navbar workaround */}</div>
      <ClickAwayListener onClickAway={() => setExpanded(false)}>
        <Navbar
          variant="dark"
          expand="md"
          expanded={expanded}
          onToggle={() => setExpanded(!expanded)}
          fixed="top"
          collapseOnSelect
        >
          <Container>
            <Navbar.Brand as={Link} to={PATHS.HOME} className="d-flex align-items-center">
              {config.title}
            </Navbar.Brand>
            <Navbar.Toggle />

            <Navbar.Collapse id="navbar-collapse">
              <Nav.Link as={Link} to={PATHS.SEARCH} className="text-white">Поиск</Nav.Link>
              <Nav.Link as={Link} to={PATHS.DONATE} className="text-white me-auto text-nowrap">
                Поддержать проект
              </Nav.Link>
              <Nav className="ms-2 me-auto" />
              {isReady && <HeaderQuickSearch indexStore={index} segmentsStore={segments} />}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </ClickAwayListener>
    </>
  );
};

export default Header;
