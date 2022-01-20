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
  const { isReady, data: { index, segments } } = useDataStore();
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
              <Nav.Link as={Link} to={PATHS.DONATE} className="text-white mr-auto">
                Поддержать проект
                <img
                  src="/static/images/BSULoot.gif"
                  alt=""
                  style={{ margin: '-6px 0 -3px 0.25rem' }}
                />
              </Nav.Link>
              <Nav className="mr-auto" />
              {isReady && <HeaderQuickSearch indexStore={index} segmentsStore={segments} />}
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </ClickAwayListener>
    </>
  );
};

export default Header;
