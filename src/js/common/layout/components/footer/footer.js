import React from 'react';
// Components
import { Container, Row } from 'react-bootstrap';
import { FooterLinksGroup } from '../footer-links-group';
// Namespace
import t from '../../../../constants/texts';
import { CHANNEL_LINKS, NETWORK_LINKS, USEFUL_LINKS } from './footer.constants';
// Utils
import { interpolate } from '../../../../utils/text';

const Footer = () => {
  const now = new Date().getFullYear();
  return (
    <footer className="page-footer font-small bg-dark text-white pt-4">
      <Container>
        <Row>
          <FooterLinksGroup title={t.footer.linksTitle} links={USEFUL_LINKS} md={6} />
          <FooterLinksGroup title={t.footer.channelsTitle} links={CHANNEL_LINKS} lg={3} md={6} />
          <FooterLinksGroup title={t.footer.networksTitle} links={NETWORK_LINKS} lg={3} md={6} />
        </Row>
      </Container>
      <div className="footer-copyright py-3 text-center small">
        <i className="far fa-copyright" />
        {interpolate(t.footer.signature, { now })}
        {' '}
        <a href="https://www.youtube.com/watch?v=Bxj09aAOFaI&lc=UgwQmdNhl4TMNn9-Gg94AaABAg.8ZY93MRq32E8ZY9W3KGSJS">
          {t.footer.commentLink}
        </a>
        {' '}
        <a href="/static/images/answer.jpg">{t.footer.screenshotLink}</a>
        .
      </div>
    </footer>
  );
};

export default Footer;
