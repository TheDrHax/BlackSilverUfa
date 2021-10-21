import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Col } from 'react-bootstrap';

const FooterLinksGroup = ({ title, links, ...rest }) => (
  <Col {...rest}>
    <h5 className="text-uppercase">{title}</h5>
    <ul className="list-unstyled">
      {links.map(({
        label,
        link,
        iconClass,
      }) => (
        <li key={link}>
          <a href={link}>
            {iconClass && <i className={`fab ${iconClass}`} />}
            {' '}
            {label}
          </a>
        </li>
      ))}
    </ul>
  </Col>
);

FooterLinksGroup.propTypes = {
  title: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    iconClass: PropTypes.string,
  })).isRequired,
};

export default FooterLinksGroup;
