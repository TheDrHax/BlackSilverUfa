import React from 'react';
import PropTypes from 'prop-types';
// Components
import { Col } from 'react-bootstrap';
import { FAIcon } from '../../utils/fontawesome';

const FooterLinksGroup = ({ title, links, ...rest }) => (
  <Col {...rest}>
    <h5 className="text-uppercase">{title}</h5>
    <ul className="list-unstyled">
      {links.map(({
        label,
        link,
        icon,
      }) => (
        <li key={link}>
          <a href={link}>
            {icon && <FAIcon icon={icon} />}
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
